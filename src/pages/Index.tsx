import { useState, DragEvent, useEffect } from "react";
import { Header } from "@/components/Header";
import { InputForm } from "@/components/InputForm";
import { LoadingState } from "@/components/LoadingState";
import { OnboardingQuiz } from "@/components/OnboardingQuiz";
import { QuizInterface } from "@/components/QuizInterface";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

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

    return <InputForm onGenerate={handleGenerate} droppedFile={droppedFile} />;
  };

  return (
    <div 
      className={cn(
        "min-h-screen relative overflow-hidden bg-background transition-colors duration-300",
        isDragging && "bg-secondary/20"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay Feedback */}
      {isDragging && (
        <div className="absolute inset-4 border-4 border-dashed border-primary/50 rounded-lg z-50 pointer-events-none flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <p className="text-2xl font-medium text-primary">Solte o arquivo para começar</p>
        </div>
      )}

      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-88px)]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
