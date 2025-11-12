import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { CheckCircle2, LogIn, UserPlus } from "lucide-react";

interface Question {
  id: number;
  pergunta: string;
}

interface ResultsDisplayProps {
  questions: Question[];
}

export const ResultsDisplay = ({ questions }: ResultsDisplayProps) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <>
      <div className="w-full max-w-3xl mx-auto space-y-6">
      <Card className="p-8 bg-card/95 backdrop-blur-sm shadow-2xl border-none">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Perguntas Geradas!
            </h2>
            <p className="text-muted-foreground">
              Aqui estão {questions.length} perguntas criadas a partir do seu material
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-foreground flex-1 pt-1">{question.pergunta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* CTA Section */}
      <Card className="p-8 bg-gradient-to-br from-secondary/10 to-accent/10 backdrop-blur-sm shadow-xl border-2 border-secondary/20">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Pronto para testar seu conhecimento?
            </h3>
            <p className="text-muted-foreground text-lg">
              Faça login ou cadastre-se para responder a estas perguntas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button 
              variant="jungle" 
              size="lg" 
              className="flex-1 gap-2"
              onClick={() => setAuthModalOpen(true)}
            >
              <LogIn className="h-5 w-5" />
              Entrar / Cadastrar
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Crie sua conta gratuitamente e comece a aprender agora mesmo!
          </p>
        </div>
      </Card>
    </div>
    <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
};
