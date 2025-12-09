import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, X, FileText, Loader2, Lightbulb } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface InputFormProps {
  onGenerate: (result: { quizId: number | null, questions: any[] | null }) => void;
  droppedFile?: File | null;
}

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
];

const MOCK_QUESTIONS = [
  {
    id: 1,
    pergunta: "Qual é o principal benefício da aprendizagem ativa?",
    opcoes: ["Memorização passiva", "Maior retenção de longo prazo", "Leitura mais rápida", "Menos esforço cognitivo"],
    resposta_correta: "Maior retenção de longo prazo"
  },
  {
    id: 2,
    pergunta: "O que caracteriza o método Pomodoro?",
    opcoes: ["Estudar 4 horas seguidas", "Intervalos de 5 minutos a cada 25 minutos", "Ler sem pausas", "Ouvir música enquanto estuda"],
    resposta_correta: "Intervalos de 5 minutos a cada 25 minutos"
  },
  {
    id: 3,
    pergunta: "Como a IA pode auxiliar nos estudos?",
    opcoes: ["Substituindo o professor", "Gerando resumos e questões personalizadas", "Escrevendo a redação inteira", "Eliminando a necessidade de ler"],
    resposta_correta: "Gerando resumos e questões personalizadas"
  }
];

export const InputForm = ({ onGenerate, droppedFile }: InputFormProps) => {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (droppedFile) {
      if (validateFile(droppedFile)) {
        setSelectedFile(droppedFile);
        handleAutoSubmit(droppedFile);
      }
    }
  }, [droppedFile]);

  const validateFile = (file: File) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type) && !file.name.endsWith('.txt')) {
      toast.error("Tipo de arquivo não suportado. Use PDF, DOCX, PPTX, ou TXT.");
      return false;
    }
    return true;
  };

  const handleAutoSubmit = async (file: File) => {
    await processSubmission(file, "");
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    await processSubmission(selectedFile, inputValue);
  };

  const handleInspireClick = () => {
    const examples = [
      "Explique a Teoria da Relatividade de Einstein",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "Resumo sobre a Revolução Industrial",
      "Quais são os princípios do Clean Code?"
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setInputValue(randomExample);
    // Optional: Focus the input after setting value
    const textarea = document.querySelector('textarea');
    if (textarea) textarea.focus();
  };

  const processSubmission = async (fileToProcess: File | null, textInput: string) => {
    if (!fileToProcess && !textInput.trim()) {
      toast.error("Por favor, digite um tópico, cole um link ou envie um arquivo.");
      return;
    }

    setIsUploading(true);

    try {
      let processingFile = fileToProcess;
      let processingUrl = "";

      if (!processingFile) {
        if (textInput.startsWith("http://") || textInput.startsWith("https://")) {
          processingUrl = textInput;
        } else {
          const blob = new Blob([textInput], { type: "text/plain" });
          processingFile = new File([blob], "topic.txt", { type: "text/plain" });
        }
      }

      if (processingFile) {
        await handleFileFlow(processingFile);
      } else if (processingUrl) {
        await handleUrlFlow(processingUrl);
      }

    } catch (error) {
      console.error('Erro:', error);
      toast.error(error instanceof Error ? error.message : "Algo deu errado");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileFlow = async (file: File) => {
    if (user) {
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('uploads').upload(filePath, file);
      if (uploadError) throw new Error(`Erro no upload: ${uploadError.message}`);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Sessão não encontrada');

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ file_path: uploadData.path, material_title: file.name })
      });
      if (!response.ok) { const err = await response.json(); throw new Error(err.error || 'Erro ao gerar quiz'); }
      const { quizId } = await response.json();
      onGenerate({ quizId: quizId, questions: null });
    } else {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/gerar-convidado', { method: 'POST', body: formData });
      if (!response.ok) { const err = await response.json(); throw new Error(err.error || 'Erro ao gerar amostra'); }
      const questions = await response.json();
      onGenerate({ quizId: null, questions: questions });
    }
  };

  const handleUrlFlow = async (url: string) => {
    if (user) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Sessão não encontrada');
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ url: url, material_title: url })
      });
      if (!response.ok) { const err = await response.json(); throw new Error(err.error); }
      const { quizId } = await response.json();
      onGenerate({ quizId: quizId, questions: null });
    } else {
      const response = await fetch('/api/generate-url-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url })
      });
      if (!response.ok) { const err = await response.json(); throw new Error(err.error); }
      const questions = await response.json();
      onGenerate({ quizId: null, questions: questions });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 flex flex-col items-center">
      <div className="text-center mb-10 space-y-4">
        <h1 className="text-5xl md:text-6xl font-light text-gradient-slim tracking-tight leading-tight">
          Aprenda qualquer coisa.
        </h1>
        <p className="text-zinc-500 font-light text-xl max-w-2xl mx-auto">
          Transforme links, arquivos ou textos em quizzes interativos instantaneamente.
        </p>
      </div>

      <div className="w-full relative group">
        <div className={cn(
            "relative w-full bg-white rounded-2xl border transition-all duration-300",
            "border-zinc-200 hover:border-zinc-300 focus-within:border-black focus-within:ring-1 focus-within:ring-black",
            "shadow-sm hover:shadow-md",
            selectedFile ? "p-4" : "p-0"
          )}>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.pptx,.docx,.txt"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && validateFile(file)) setSelectedFile(file);
            }}
          />

          {selectedFile ? (
            <div className="flex items-center justify-between w-full h-32 md:h-40 bg-zinc-50 rounded-xl border border-dashed border-zinc-300 px-6">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-lg border border-zinc-200 shadow-sm">
                  <FileText className="h-8 w-8 text-black" />
                </div>
                <div>
                  <p className="font-medium text-lg text-black">{selectedFile.name}</p>
                  <p className="text-zinc-500 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearFile}
                className="hover:bg-zinc-200 rounded-full h-10 w-10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="relative">
              {/* Lightbulb Icon */}
              <button
                onClick={handleInspireClick}
                className="absolute top-4 left-4 p-2 text-zinc-400 hover:text-yellow-500 transition-colors z-10"
                title="Me dê uma ideia"
              >
                <Lightbulb className="w-5 h-5" />
              </button>

              <textarea
                placeholder="O que você quer aprender hoje? Cole um link, digite um tópico ou arraste um arquivo..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!isUploading && inputValue.trim()) handleSubmit();
                   }
                }}
                className="w-full min-h-[160px] md:min-h-[200px] p-6 pl-14 pr-6 text-lg md:text-xl font-light bg-transparent border-none resize-none focus:ring-0 placeholder:text-zinc-300"
                style={{ outline: 'none', boxShadow: 'none' }}
                spellCheck={false}
              />

              {/* Bottom Actions */}
              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                 <span className="text-xs text-zinc-300 font-light hidden md:inline-block pointer-events-none select-none">
                    Arraste arquivos PDF, DOCX, PPTX
                 </span>
                 <Button
                  size="lg"
                  className="h-12 w-12 rounded-full bg-black text-white hover:bg-black/80 shadow-lg transition-all disabled:opacity-50 p-0 flex items-center justify-center"
                  onClick={handleSubmit}
                  disabled={isUploading || (!inputValue.trim() && !selectedFile)}
                >
                  {isUploading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <ArrowRight className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
