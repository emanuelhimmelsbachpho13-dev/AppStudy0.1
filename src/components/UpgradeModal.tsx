import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, Zap, Clock, Shield, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-none shadow-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-4xl font-bold text-center text-foreground tracking-tight mb-2">
            Professional Plan
          </DialogTitle>
          <p className="text-center text-muted-foreground text-lg">
            Desbloqueie todo o potencial dos seus estudos
          </p>
        </DialogHeader>

        <div className="space-y-8 py-4 px-2">
          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly Plan - Basic Style */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={cn(
                "cursor-pointer p-8 rounded-xl border transition-all duration-200 relative",
                selectedPlan === 'monthly'
                  ? "border-primary ring-1 ring-primary shadow-sm"
                  : "border-border hover:border-foreground/50"
              )}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-foreground">Mensal</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">R$ 20</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground">Faturamento mensal. Cancele a qualquer momento.</p>

                {selectedPlan === 'monthly' && (
                  <div className="absolute top-4 right-4 text-primary">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>

            {/* Annual Plan - Recommended Style */}
            <div
              onClick={() => setSelectedPlan('annual')}
              className={cn(
                "cursor-pointer p-8 rounded-xl border transition-all duration-200 relative",
                selectedPlan === 'annual'
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "border-border hover:border-foreground/50"
              )}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase border border-background">
                Recomendado
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className={cn("text-xl font-medium", selectedPlan === 'annual' ? "text-primary-foreground" : "text-foreground")}>Anual</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={cn("text-4xl font-bold", selectedPlan === 'annual' ? "text-primary-foreground" : "text-foreground")}>R$ 120</span>
                  <span className={cn(selectedPlan === 'annual' ? "text-primary-foreground/80" : "text-muted-foreground")}>/ano</span>
                </div>
                <p className={cn("text-sm", selectedPlan === 'annual' ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  Equivalente a <span className="font-bold">R$ 10/mês</span>. Economize 50%.
                </p>
                 {selectedPlan === 'annual' && (
                  <div className="absolute top-4 right-4 text-primary-foreground">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>
          </div>

           {/* Benefits */}
           <div className="space-y-4 pt-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider text-center mb-4">
              O que está incluído
            </h4>
            <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-foreground/70" />
                    <p className="text-sm font-medium text-foreground/90">{benefit.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 space-y-3">
            <Button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full h-12 text-base font-semibold rounded-lg shadow-sm"
              variant={selectedPlan === 'annual' ? 'default' : 'outline'}
            >
              {isUpgrading ? "Processando..." : (selectedPlan === 'annual' ? "Assinar Plano Anual" : "Assinar Plano Mensal")}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Pagamento seguro processado via Stripe. Reembolso garantido em até 7 dias.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
