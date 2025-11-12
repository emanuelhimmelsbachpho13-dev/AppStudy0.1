import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UpgradeModal } from "./UpgradeModal";

interface Question {
  id: number;
  pergunta: string;
}

interface QuizResultsProps {
  questions: Question[];
  answers: { [key: number]: string };
  onRetry: () => void;
  onLoadNew: () => void;
}

export const QuizResults = ({ questions, answers, onRetry, onLoadNew }: QuizResultsProps) => {
  const { user } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    // Show upgrade modal for free users
    if (user?.planType === 'free' || !user?.planType) {
      setShowUpgradeModal(true);
    }
  }, [user]);

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto bg-card/95 backdrop-blur-sm shadow-2xl border-none">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-secondary" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Parabéns! Quiz Completo!
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Você respondeu todas as {questions.length} perguntas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/20 rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4">Suas Respostas:</h3>
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="border-l-4 border-secondary pl-4 py-2">
                  <p className="font-medium text-foreground mb-1">{q.pergunta}</p>
                  <p className="text-muted-foreground">{answers[q.id]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button 
              onClick={onRetry}
              variant="outline"
              size="lg"
              className="w-full"
            >
              Tentar Novamente
            </Button>
            <Button 
              onClick={onLoadNew}
              variant="jungle"
              size="lg"
              className="w-full"
            >
              Carregar Outro Material
            </Button>
          </div>
        </CardContent>
      </Card>

      <UpgradeModal 
        open={showUpgradeModal} 
        onOpenChange={setShowUpgradeModal}
      />
    </>
  );
};
