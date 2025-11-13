const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const PptxParser = require('node-pptx-parser');
const { YoutubeTranscript } = require('youtube-transcript');
const fs = require('fs');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let textContent = '';
  let materialTitle = 'Quiz';

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!supabaseUrl || !supabaseServiceKey || !geminiApiKey) {
      return res.status(500).json({ error: 'Missing environment variables' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const genAI = new GoogleGenerativeAI(geminiApiKey);

    const { file_path, url, material_title: title } = req.body;
    if (title) materialTitle = title;

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    const token = authHeader.replace('Bearer ', '');

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (file_path) {
      // --- FLUXO DE ARQUIVO ---
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('uploads')
        .download(file_path);

      if (downloadError) {
        throw new Error(`Failed to download file: ${downloadError.message}`);
      }

      const buffer = Buffer.from(await fileData.arrayBuffer());
      const lowerPath = file_path.toLowerCase();

      if (lowerPath.endsWith('.pdf')) {
        const pdfData = await pdfParse(buffer);
        textContent = pdfData.text || '';
      } else if (lowerPath.endsWith('.docx')) {
        const docxData = await mammoth.extractRawText({ buffer });
        textContent = docxData?.value || '';
      } else if (lowerPath.endsWith('.pptx')) {
        // node-pptx-parser precisa de um caminho de arquivo
        const tempPath = `/tmp/${Date.now()}.pptx`;
        fs.writeFileSync(tempPath, buffer);
        const parser = new PptxParser(tempPath);
        const textData = await parser.extractText();
        textContent = textData.map((slide) => slide.text).join('\n\n');
        fs.unlinkSync(tempPath); // Limpa o arquivo temporário
      } else if (lowerPath.endsWith('.txt')) {
        textContent = buffer.toString('utf-8');
      } else {
        return res.status(400).json({ error: 'Tipo de arquivo não suportado' });
      }
    } else if (url) {
      // --- FLUXO DE URL (YOUTUBE) ---
      materialTitle = title || url;
      const transcriptData = await YoutubeTranscript.fetchTranscript(url);
      textContent = Array.isArray(transcriptData) ? transcriptData.map((item) => item.text ?? '').join(' ') : '';
    } else {
      return res.status(400).json({ error: 'Nenhum arquivo (file_path) ou URL (url) foi fornecido' });
    }

    if (!textContent || textContent.trim().length === 0) {
      return res.status(400).json({ error: 'Nenhum conteúdo de texto encontrado no material' });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction:
        'Você é um assistente educacional especialista em criar quizzes. Baseado no texto fornecido, gere 7 perguntas de múltipla escolha. Sua resposta deve ser APENAS um JSON válido, seguindo este formato exato: [ { "pergunta": "...", "opcoes": ["A", "B", "C", "D"], "resposta_correta": "A" } ] Não inclua ```json ou qualquer outro texto antes ou depois do array JSON.',
    });

    const prompt = `Analise o seguinte texto e gere 7 perguntas de múltipla escolha:\n\n${textContent.substring(0, 30000)}`;

    const result = await model.generateContent(prompt);
    const generatedText = (await result.response).text();

    let questions;

    try {
      const cleanedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      questions = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Generated text:', generatedText);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert({ user_id: user.id, material_title: materialTitle, created_at: new Date().toISOString() })
      .select()
      .single();

    if (quizError) {
      return res.status(500).json({ error: `Failed to create quiz: ${quizError.message}` });
    }

    const quizId = quizData.id;

    const questionsToInsert = questions.map((q, index) => ({
      quiz_id: quizId,
      pergunta: q.pergunta,
      opcoes: q.opcoes,
      resposta_correta: q.resposta_correta,
      ordem: index + 1,
    }));

    const { error: questionsError } = await supabase.from('questions').insert(questionsToInsert);

    if (questionsError) {
      return res.status(500).json({ error: `Failed to insert questions: ${questionsError.message}` });
    }

    return res.status(200).json({ quizId });
  } catch (error) {
    console.error('Server error (generate.cjs):', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
