const { GoogleGenerativeAI } = require('@google/generative-ai');
const { YoutubeTranscript } = require('youtube-transcript');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
  }

  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const transcriptData = await YoutubeTranscript.fetchTranscript(url);
    const textContent = Array.isArray(transcriptData) ? transcriptData.map((item) => item.text ?? '').join(' ') : '';

    if (!textContent || textContent.trim().length === 0) {
      return res.status(400).json({ error: 'Não foi possível extrair a transcrição do YouTube' });
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction:
        'Você é um assistente educacional. Baseado no texto, gere 5 perguntas de múltipla escolha. Sua resposta deve ser APENAS um JSON válido, no formato: [ { "id": 1, "pergunta": "...", "opcoes": ["A", "B"], "resposta_correta": "A" }, { "id": 2, "pergunta": "..." } ] Não inclua ```json ou qualquer outro texto.',
    });

    const prompt = `Analise o seguinte texto e gere 5 perguntas de múltipla escolha:\n\n${textContent.substring(0, 20000)}`;
    const result = await model.generateContent(prompt);
    const generatedText = (await result.response).text();

    let questions;
    try {
      const cleanedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      questions = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parse error (guest url):', parseError, 'Generated text:', generatedText);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    return res.status(200).json(questions);
  } catch (error) {
    console.error('Guest API error (URL):', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
