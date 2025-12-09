import { Header } from "@/components/Header";
import { Upload, Zap, CreditCard } from "lucide-react";

const Documento = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-foreground">
      <Header />

      <main className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-20 space-y-4">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-black">
              Como Usar
            </h1>
            <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto">
              Guia rápido para transformar seus materiais de estudo em quizzes interativos em segundos.
            </p>
          </div>

          {/* Steps Container */}
          <div className="space-y-16">

            {/* Step 1: Upload */}
            <section className="flex flex-col md:flex-row gap-8 items-start border-b border-zinc-100 pb-16">
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center flex-shrink-0">
                <Upload className="w-8 h-8 text-black stroke-[1.5]" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-medium text-black">1. Upload ou Link</h2>
                <p className="text-zinc-600 font-light leading-relaxed text-lg">
                  Arraste seu arquivo <strong>PDF, DOCX ou PPTX</strong> diretamente para a página inicial.
                  Você também pode colar um link de vídeo do <strong>YouTube</strong> ou apenas digitar um tópico que deseja aprender.
                </p>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100 inline-block text-sm text-zinc-500">
                  Dica: A área de drag-and-drop funciona em toda a tela inicial.
                </div>
              </div>
            </section>

            {/* Step 2: Generation */}
            <section className="flex flex-col md:flex-row gap-8 items-start border-b border-zinc-100 pb-16">
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center flex-shrink-0">
                <Zap className="w-8 h-8 text-black stroke-[1.5]" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-medium text-black">2. Geração Inteligente</h2>
                <p className="text-zinc-600 font-light leading-relaxed text-lg">
                  Nossa Inteligência Artificial analisa o conteúdo enviado instantaneamente.
                  Ela extrai os pontos chave e cria perguntas de múltipla escolha para testar seu conhecimento.
                </p>
              </div>
            </section>

            {/* Step 3: Plans */}
            <section className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-8 h-8 text-black stroke-[1.5]" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-medium text-black">3. Planos e Limites</h2>
                <p className="text-zinc-600 font-light leading-relaxed text-lg">
                  Usuários gratuitos têm um limite diário de gerações de perguntas.
                  Assine o plano <strong>Pro</strong> para desbloquear gerações ilimitadas, uploads de arquivos maiores e histórico completo.
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Documento;
