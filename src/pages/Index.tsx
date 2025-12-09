import { useState, DragEvent } from "react";
import { Header } from "@/components/Header";
import { InputForm } from "@/components/InputForm";
import { LoadingState } from "@/components/LoadingState";
import { OnboardingQuiz } from "@/components/OnboardingQuiz";
import { QuizInterface } from "@/components/QuizInterface";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { CheckCircle2, Zap, Layout, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Question {
  id: number;
  pergunta: string;
  opcoes: string[];
  resposta_correta: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [quizId, setQuizId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const { isLoggedIn, hasProfile } = useAuth();

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);

  const handleGenerate = (result: { quizId: number | null, questions: any[] | null }) => {
    setIsLoading(true);
    setQuestions(null);
    setQuizId(null);

    if (result.quizId) {
      setQuizId(result.quizId);
      setQuestions([{ id: 1, pergunta: "Carregando quiz...", opcoes: [], resposta_correta: "" }]); 
    } else if (result.questions) {
      setQuizId(null);
      setQuestions(result.questions);
    }
    
    setIsLoading(false);
  };
  
  const handleLoadNew = () => {
    setQuestions(null);
    setQuizId(null);
    setIsLoading(false);
    setDroppedFile(null); // Reset dropped file
  };

  // Drag Handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we are leaving the main container
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setDroppedFile(e.dataTransfer.files[0]);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (isLoggedIn && !hasProfile) {
      return <OnboardingQuiz />;
    }

    if (questions && !isLoggedIn) {
      return <ResultsDisplay questions={questions} />;
    }

    if (questions && isLoggedIn && hasProfile) {
      if (!quizId) {
        handleLoadNew();
        return <InputForm onGenerate={handleGenerate} droppedFile={droppedFile} />;
      }
      return (
        <QuizInterface 
          quizId={quizId}
          onLoadNew={handleLoadNew}
        />
      );
    }

    // Default Hero State (InputForm)
    return (
      <div className="w-full">
         <InputForm onGenerate={handleGenerate} droppedFile={droppedFile} />
      </div>
    );
  };

  // If showing quiz results or interface, we don't show the landing page sections
  const isShowingQuiz = isLoading || questions || (isLoggedIn && !hasProfile);

  return (
    <div 
      className={cn(
        "min-h-screen relative overflow-x-hidden bg-background transition-colors duration-300 font-sans selection:bg-black/10",
        isDragging && "bg-secondary/20"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay Feedback */}
      {isDragging && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-8">
           <div className="w-full h-full border-4 border-dashed border-black rounded-3xl flex items-center justify-center animate-pulse">
              <p className="text-4xl font-light text-black">Solte o arquivo para começar</p>
           </div>
        </div>
      )}

      <Header />
        
      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-12 md:pt-24 pb-16 min-h-[70vh] flex flex-col items-center justify-center">
          {renderContent()}
        </section>

        {/* Show Landing Page Sections only if NOT showing quiz/results */}
        {!isShowingQuiz && (
          <>
            {/* How It Works */}
            <section className="w-full py-24 bg-white border-t border-zinc-100">
              <div className="container mx-auto px-4">
                 <div className="text-center mb-16">
                    <h2 className="text-3xl font-medium mb-4">Como funciona</h2>
                    <p className="text-zinc-500 font-light">Transforme horas de estudo em minutos.</p>
                 </div>

                 <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    {[
                      { icon: Layout, title: "1. Envie seu Material", desc: "Cole um link do YouTube ou arraste um PDF, DOCX ou PPTX." },
                      { icon: Zap, title: "2. IA Processa", desc: "Nossa tecnologia analisa o conteúdo e identifica os pontos chave." },
                      { icon: CheckCircle2, title: "3. Pratique", desc: "Receba um quiz personalizado para fixar o conhecimento." }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center text-center group">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mb-6 group-hover:border-black transition-colors">
                          <item.icon className="w-6 h-6 text-black stroke-[1.5]" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                        <p className="text-zinc-500 font-light leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </section>

            {/* Pricing Preview */}
            <section className="w-full py-24 bg-zinc-50/50 border-t border-zinc-100">
              <div className="container mx-auto px-4">
                 <div className="text-center mb-16">
                    <h2 className="text-3xl font-medium mb-4">Planos Simples</h2>
                    <p className="text-zinc-500 font-light">Comece grátis, evolua quando precisar.</p>
                 </div>

                 <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free */}
                    <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm flex flex-col">
                       <h3 className="text-xl font-medium mb-2">Basic</h3>
                       <div className="text-3xl font-semibold mb-6">R$ 0</div>
                       <ul className="space-y-4 mb-8 flex-1">
                          <li className="flex items-center gap-3 text-sm text-zinc-600">
                            <CheckCircle2 className="w-4 h-4 text-black" /> 3 gerações por dia
                          </li>
                          <li className="flex items-center gap-3 text-sm text-zinc-600">
                            <CheckCircle2 className="w-4 h-4 text-black" /> Uploads de até 5MB
                          </li>
                       </ul>
                       <Button variant="outline" className="w-full border-zinc-200 hover:bg-zinc-50">Começar Grátis</Button>
                    </div>

                    {/* Pro */}
                    <div className="bg-white p-8 rounded-2xl border border-black shadow-md flex flex-col relative overflow-hidden">
                       <div className="absolute top-0 right-0 bg-black text-white text-xs px-3 py-1 rounded-bl-xl font-medium">POPULAR</div>
                       <h3 className="text-xl font-medium mb-2">Pro</h3>
                       <div className="text-3xl font-semibold mb-6">R$ 20<span className="text-base font-normal text-zinc-400">/mês</span></div>
                       <ul className="space-y-4 mb-8 flex-1">
                          <li className="flex items-center gap-3 text-sm text-zinc-900 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-black" /> Gerações ilimitadas
                          </li>
                          <li className="flex items-center gap-3 text-sm text-zinc-900 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-black" /> Histórico completo
                          </li>
                          <li className="flex items-center gap-3 text-sm text-zinc-900 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-black" /> Suporte prioritário
                          </li>
                       </ul>
                       <Button className="w-full bg-black text-white hover:bg-black/90">Assinar Pro</Button>
                    </div>
                 </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Simple Footer */}
      {!isShowingQuiz && (
         <footer className="py-8 border-t border-zinc-100 bg-white">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-zinc-500 font-light">
               <p>© 2024 AppStudy Inc.</p>
               <div className="flex gap-6 mt-4 md:mt-0">
                  <a href="#" className="hover:text-black">Termos</a>
                  <a href="#" className="hover:text-black">Privacidade</a>
                  <a href="#" className="hover:text-black">Twitter</a>
               </div>
            </div>
         </footer>
      )}
    </div>
  );
};

export default Index;
