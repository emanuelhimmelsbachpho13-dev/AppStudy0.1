import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, Zap, Clock, Shield, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpgradeModal = ({ open, onOpenChange }: UpgradeModalProps) => {
  const { upgradePlan } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [isUpgrading, setIsUpgrading] = useState(false);

  const benefits = [
    { icon: Sparkles, text: "Gerações ilimitadas de perguntas" },
    { icon: Zap, text: "Acesso prioritário à plataforma" },
    { icon: Clock, text: "Histórico completo de quizzes" },
    { icon: Shield, text: "Suporte premium" },
    { icon: TrendingUp, text: "Relatórios de progresso avançados" },
  ];

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await upgradePlan(selectedPlan);
      toast.success("Plano atualizado com sucesso!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao atualizar plano. Tente novamente.");
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-foreground mb-2">
            Desbloqueie Todo o Potencial
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Escolha o plano ideal para turbinar seus estudos
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Benefits */}
          <div className="space-y-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-secondary" />
                  </div>
                  <p className="text-foreground font-medium">{benefit.text}</p>
                </div>
              );
            })}
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Monthly Plan */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`cursor-pointer p-6 rounded-xl border-2 transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-secondary bg-secondary/5 shadow-lg'
                  : 'border-border hover:border-secondary/50'
              }`}
            >
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Mensal</h3>
                  <p className="text-sm text-muted-foreground">Cancele quando quiser</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">R$ 20</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                {selectedPlan === 'monthly' && (
                  <div className="flex items-center gap-2 text-secondary">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Selecionado</span>
                  </div>
                )}
              </div>
            </div>

            {/* Annual Plan */}
            <div
              onClick={() => setSelectedPlan('annual')}
              className={`cursor-pointer p-6 rounded-xl border-2 transition-all relative ${
                selectedPlan === 'annual'
                  ? 'border-secondary bg-secondary/5 shadow-lg'
                  : 'border-border hover:border-secondary/50'
              }`}
            >
              <div className="absolute -top-3 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                50% OFF
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Anual</h3>
                  <p className="text-sm text-muted-foreground">Economize R$ 120/ano</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">R$ 120</span>
                  <span className="text-muted-foreground">/ano</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="line-through">R$ 240</span>
                  <span className="ml-2 text-secondary font-semibold">R$ 10/mês</span>
                </div>
                {selectedPlan === 'annual' && (
                  <div className="flex items-center gap-2 text-secondary">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Selecionado</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full"
              variant="jungle"
              size="lg"
            >
              {isUpgrading ? "Processando..." : "Assine Agora"}
            </Button>
            <button
              onClick={() => onOpenChange(false)}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Talvez mais tarde
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
