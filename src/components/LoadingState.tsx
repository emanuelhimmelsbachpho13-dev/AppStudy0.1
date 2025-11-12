import { Card } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

export const LoadingState = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto p-12 bg-card/95 backdrop-blur-sm shadow-2xl border-none">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 text-secondary animate-spin" />
            <Sparkles className="h-8 w-8 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Gerando suas perguntas...
          </h2>
          <p className="text-muted-foreground">
            Estamos analisando seu material e criando questões personalizadas.
          </p>
        </div>
        <div className="flex justify-center gap-2">
          <div className="h-2 w-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="h-2 w-2 bg-secondary rounded-full animate-bounce" />
        </div>
      </div>
    </Card>
  );
};
