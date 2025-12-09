import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Paperclip, ArrowRight, X, FileText, Loader2, PlayCircle } from "lucide-react";
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    await processSubmission(selectedFile, inputValue);
  };

  const handleDemoClick = () => {
    setIsUploading(true);
    // Simulate a small delay for realism
    setTimeout(() => {
      setIsUploading(false);
      onGenerate({ quizId: null, questions: MOCK_QUESTIONS });
      toast.success("Exemplo carregado com sucesso!");
    }, 800);
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
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-medium mb-4 text-foreground tracking-tight leading-tight">
          O que você quer aprender hoje?
        </h1>
        <p className="text-muted-foreground font-light text-lg">
          Transforme qualquer conteúdo em quiz.
        </p>
      </div>

      <div className="relative group">
        <div className={cn(
            "relative flex items-center bg-white rounded-xl border border-zinc-200 transition-all",
            "shadow-[0_2px_8px_rgba(0,0,0,0.04)]", // Sombra muito sutil
            "focus-within:shadow-[0_4px_12px_rgba(0,0,0,0.06)] focus-within:border-black/10",
            "hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:border-black/10"
          )}>

          <div className="pl-3">
             <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.pptx,.docx,.txt"
              onChange={handleFileSelect}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </div>

          {selectedFile ? (
            <div className="flex-1 flex items-center px-4 py-4 h-16">
              <div className="flex items-center gap-3 bg-zinc-50 px-3 py-1.5 rounded-md border border-zinc-200">
                <FileText className="h-4 w-4 text-black" />
                <span className="text-sm font-medium truncate max-w-[200px] md:max-w-[300px]">{selectedFile.name}</span>
                <button onClick={handleClearFile} className="ml-2 hover:bg-black/10 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ) : (
            <Input
              type="text"
              placeholder="Cole um link do YouTube, digite um tema ou arraste um arquivo..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isUploading) {
                  handleSubmit();
                }
              }}
              className="flex-1 border-none shadow-none focus-visible:ring-0 h-14 text-base md:text-lg bg-transparent placeholder:text-muted-foreground/50 font-light"
            />
          )}

          <div className="pr-2">
            <Button
              size="icon"
              className="h-10 w-10 rounded-lg bg-black text-white hover:bg-black/80 transition-all disabled:opacity-50"
              onClick={handleSubmit}
              disabled={isUploading || (!inputValue.trim() && !selectedFile)}
            >
              {isUploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Helper Text & Demo Button */}
        <div className="mt-6 flex flex-col items-center gap-4">
           <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground/70 font-normal">
             <span className="flex items-center gap-1.5">
               <div className="w-1 h-1 rounded-full bg-zinc-300" />
               PDF, DOCX, PPTX, TXT
             </span>
             <span className="flex items-center gap-1.5">
               <div className="w-1 h-1 rounded-full bg-zinc-300" />
               YouTube Links
             </span>
           </div>

           <button
            onClick={handleDemoClick}
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-black transition-colors group"
           >
             <span>Não tem material?</span>
             <span className="font-medium underline decoration-1 underline-offset-4 decoration-zinc-300 group-hover:decoration-black flex items-center gap-1">
               <PlayCircle className="w-3 h-3" />
               Ver um exemplo
             </span>
           </button>
        </div>
      </div>
    </div>
  );
};
