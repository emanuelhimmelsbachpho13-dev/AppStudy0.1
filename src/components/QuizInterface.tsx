import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";

interface Question {
  id: number;
  pergunta: string;
}

interface QuizInterfaceProps {
  questions: Question[];
}

export const QuizInterface = ({ questions }: QuizInterfaceProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) {
      toast.error("Por favor, escreva uma resposta");
      return;
    }

    setAnswers({ ...answers, [currentQuestion.id]: currentAnswer });
    toast.success("Resposta salva!");
    setCurrentAnswer("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsSubmitted(true);
      toast.success("Quiz completo! Todas as respostas foram salvas.");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentAnswer(answers[questions[currentQuestionIndex - 1].id] || "");
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-sm border-jungle-accent/20 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-jungle-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-jungle-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-jungle-dark">
            Parabéns! Quiz Completo!
          </CardTitle>
          <CardDescription className="text-lg text-jungle-medium">
            Você respondeu todas as {questions.length} perguntas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-jungle-light/20 rounded-lg p-6">
            <h3 className="font-semibold text-jungle-dark mb-3">Suas Respostas:</h3>
            <div className="space-y-3">
              {questions.map((q) => (
                <div key={q.id} className="border-l-4 border-jungle-accent pl-4">
                  <p className="font-medium text-jungle-dark">{q.pergunta}</p>
                  <p className="text-jungle-medium mt-1">{answers[q.id]}</p>
                </div>
              ))}
            </div>
          </div>
          <Button 
            onClick={() => {
              setCurrentQuestionIndex(0);
              setAnswers({});
              setCurrentAnswer("");
              setIsSubmitted(false);
            }}
            variant="jungle"
            className="w-full"
          >
            Fazer Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-sm border-jungle-accent/20 shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardDescription className="text-jungle-medium">
            Pergunta {currentQuestionIndex + 1} de {questions.length}
          </CardDescription>
          <span className="text-sm font-medium text-jungle-dark">
            {Math.round(progress)}% completo
          </span>
        </div>
        <Progress value={progress} className="mb-4" />
        <CardTitle className="text-2xl font-bold text-jungle-dark">
          {currentQuestion.pergunta}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-jungle-dark">
            Sua resposta:
          </label>
          <Textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Digite sua resposta aqui..."
            className="min-h-[150px] resize-none"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentQuestionIndex === 0}
            className="flex-1"
          >
            Anterior
          </Button>
          <Button
            onClick={handleSubmitAnswer}
            variant="jungle"
            className="flex-1"
          >
            {currentQuestionIndex === questions.length - 1 ? "Finalizar" : "Próxima"}
          </Button>
        </div>

        {Object.keys(answers).length > 0 && (
          <div className="text-sm text-jungle-medium text-center">
            {Object.keys(answers).length} de {questions.length} perguntas respondidas
          </div>
        )}
      </CardContent>
    </Card>
  );
};
