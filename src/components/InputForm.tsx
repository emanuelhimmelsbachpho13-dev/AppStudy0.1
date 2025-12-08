import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload, Paperclip, ArrowRight, X, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

export const InputForm = ({ onGenerate, droppedFile }: InputFormProps) => {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle dropped file prop changes
  useEffect(() => {
    if (droppedFile) {
      if (validateFile(droppedFile)) {
        setSelectedFile(droppedFile);
        // Automatically start upload if dropped? User prompt says "site deve reagir visualmente... e iniciar o upload imediatamente".
        // To be safe and avoid recursion or duplicate calls if useEffect fires multiple times, we might want a flag or just call the submit function.
        // However, we need to be careful with async inside useEffect.
        // Let's set the file and maybe trigger a separate effect or just call a function.
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
    // Need to wait for state update or pass file directly
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

  const processSubmission = async (fileToProcess: File | null, textInput: string) => {
    if (!fileToProcess && !textInput.trim()) {
      toast.error("Por favor, digite um tópico, cole um link ou envie um arquivo.");
      return;
    }

    setIsUploading(true);

    try {
      // Determine mode: File, URL, or Topic
      let processingFile = fileToProcess;
      let processingUrl = "";

      if (!processingFile) {
        if (textInput.startsWith("http://") || textInput.startsWith("https://")) {
          processingUrl = textInput;
        } else {
          // Topic mode: Create a text file from the input
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
      // --- LOGGED IN (File) ---
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

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
      // --- GUEST (File) ---
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/gerar-convidado', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) { const err = await response.json(); throw new Error(err.error || 'Erro ao gerar amostra'); }

      const questions = await response.json();
      onGenerate({ quizId: null, questions: questions });
    }
  };

  const handleUrlFlow = async (url: string) => {
    if (user) {
      // --- LOGGED IN (URL) ---
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
      // --- GUEST (URL) ---
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
        <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-foreground tracking-tight">
          O que você quer aprender hoje?
        </h1>
      </div>

      <div className="relative group">
        <div className="relative flex items-center bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-2xl border border-transparent transition-all focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.12)] focus-within:border-black/5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)]">

          {/* File Upload Trigger */}
          <div className="pl-4">
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

          {/* Main Input */}
          {selectedFile ? (
            <div className="flex-1 flex items-center px-4 py-4 h-16">
              <div className="flex items-center gap-3 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/50">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium truncate max-w-[200px] md:max-w-[300px]">{selectedFile.name}</span>
                <button onClick={handleClearFile} className="ml-2 hover:bg-black/10 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ) : (
            <Input
              type="text"
              placeholder="Cole um link ou digite um tópico..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isUploading) {
                  handleSubmit();
                }
              }}
              className="flex-1 border-none shadow-none focus-visible:ring-0 h-16 text-lg bg-transparent placeholder:text-muted-foreground/60"
            />
          )}

          {/* Submit Button */}
          <div className="pr-2">
            <Button
              size="icon"
              className="h-10 w-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
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

        {/* Helper Text */}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
           <span className="flex items-center gap-1.5">
             <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
             PDF, DOCX, PPTX, TXT
           </span>
           <span className="flex items-center gap-1.5">
             <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
             YouTube Links
           </span>
        </div>
      </div>
    </div>
  );
};
