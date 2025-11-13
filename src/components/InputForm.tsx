import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Upload, Link as LinkIcon, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext"; // Agora é o AuthContext real
import { toast } from "sonner"; // Usando sonner

interface InputFormProps {
  // Atualizado para lidar com os dois fluxos
  onGenerate: (result: { quizId: number | null, questions: any[] | null }) => void;
}

// Lista de tipos de arquivo suportados
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'text/plain', // .txt
];

export const InputForm = ({ onGenerate }: InputFormProps) => {
  const { user } = useAuth(); // Pega o usuário REAL (ou null se for convidado)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("file");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validação do tipo de arquivo
      if (!ALLOWED_FILE_TYPES.includes(file.type) && !file.name.endsWith('.txt')) {
        toast.error("Tipo de arquivo não suportado. Use PDF, DOCX, PPTX, ou TXT.");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  // --- O NOVO CÉREBRO DO FUNIL ---

  // 1. O "CÉREBRO" PRINCIPAL
  const handleSmartGenerate = async () => {
    if (activeTab === 'file') {
      await handleFileGenerate();
    } else {
      await handleUrlGenerate();
    }
  };

  // 2. FUNÇÃO DE GERAÇÃO DE ARQUIVO (Funil Duplo)
  const handleFileGenerate = async () => {
    if (!selectedFile) {
      toast.error("Por favor, selecione um arquivo.");
      return;
    }
    setIsUploading(true);

    try {
      if (user) {
        // --- FLUXO LOGADO (Arquivo) ---

        // 2A. CORREÇÃO DO BUG RLS: Usar user.id real no path
        const filePath = `${user.id}/${Date.now()}_${selectedFile.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filePath, selectedFile);

        if (uploadError) throw new Error(`Erro no upload: ${uploadError.message}`);

        // 3A. Chamar API segura
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Sessão não encontrada');

        const response = await fetch('/api/generate.cjs', { // ATENÇÃO: .cjs
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
          body: JSON.stringify({ file_path: uploadData.path, material_title: selectedFile.name })
        });
        if (!response.ok) { const err = await response.json(); throw new Error(err.error || 'Erro ao gerar quiz'); }
        
        const { quizId } = await response.json();
        onGenerate({ quizId: quizId, questions: null });

      } else {
        // --- FLUXO DE CONVIDADO (Arquivo) ---

        // 2B. Enviar arquivo para a nova API pública
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const response = await fetch('/api/gerar-convidado.cjs', { // ATENÇÃO: .cjs
          method: 'POST',
          // REMOVA o header 'Content-Type', o navegador define
          body: formData
        });

        if (!response.ok) { const err = await response.json(); throw new Error(err.error || 'Erro ao gerar amostra'); }
        
        const questions = await response.json();
        onGenerate({ quizId: null, questions: questions });
      }
    } catch (error) {
      console.error('Erro (Arquivo):', error);
      toast.error(error instanceof Error ? error.message : "Algo deu errado");
    } finally {
      setIsUploading(false);
    }
  };

  // 3. FUNÇÃO DE GERAÇÃO DE URL (Funil Duplo)
  const handleUrlGenerate = async () => {
    if (!linkUrl) {
      toast.error("Por favor, insira uma URL.");
      return;
    }
    setIsUploading(true);

    try {
      if (user) {
        // --- FLUXO LOGADO (URL) ---
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Sessão não encontrada');

        const response = await fetch('/api/generate.cjs', { // Chama a mesma API segura
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
          body: JSON.stringify({ url: linkUrl, material_title: linkUrl })
        });
        if (!response.ok) { const err = await response.json(); throw new Error(err.error); }
        const { quizId } = await response.json();
        onGenerate({ quizId: quizId, questions: null });

      } else {
        // --- FLUXO CONVIDADO (URL) ---
        const response = await fetch('/api/generate-url-guest.cjs', { // Chama a nova API pública de URL
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: linkUrl })
        });
        if (!response.ok) { const err = await response.json(); throw new Error(err.error); }
        const questions = await response.json();
        onGenerate({ quizId: null, questions: questions });
      }
    } catch (error) {
      console.error('Erro (URL):', error);
      toast.error(error instanceof Error ? error.message : "Algo deu errado");
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <Card className="w-full max-w-2xl mx-auto p-8 bg-card/95 backdrop-blur-sm shadow-2xl border-none">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 text-foreground leading-tight">
          Estudar não precisa ser um saco
        </h1>
        <p className="text-lg text-muted-foreground">
          Gere flashcards e questões de múltipla escolha em segundos.
        </p>
      </div>

      <Tabs defaultValue="file" className="w-full" onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="file" className="gap-2">
            <Upload className="h-4 w-4" />
            Enviar Arquivo
          </TabsTrigger>
          <TabsTrigger value="link" className="gap-2">
            <LinkIcon className="h-4 w-4" />
            Link Externo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-secondary transition-colors cursor-pointer">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.pptx,.docx,.txt" // Atualizado
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                {selectedFile
                  ? selectedFile.name
                  : "Clique para fazer upload ou arraste arquivos aqui"}
              </p>
              <p className="text-xs text-muted-foreground">
                Suporta PDF, PPTX, DOCX, TXT
              </p>
            </label>
          </div>
        </TabsContent>

        <TabsContent value="link" className="space-y-4">
          <Input
            type="url"
            placeholder="ou cole um link (ex: vídeo do YouTube)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="h-12 text-base bg-muted/50"
          />
        </TabsContent>

        <Button
          variant="jungle"
          size="lg"
          className="w-full mt-6"
          onClick={handleSmartGenerate} // Chama o "cérebro"
          disabled={(activeTab === 'file' ? !selectedFile : !linkUrl) || isUploading}
        >
          <Sparkles className="h-5 w-5" />
          {isUploading ? "Gerando quiz..." : "Gerar Perguntas"}
        </Button>
      </Tabs>
    </Card>
  );
};