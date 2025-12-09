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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-zinc-100 shadow-2xl rounded-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-medium text-center text-black tracking-tight mb-2">
            Plano Profissional
          </DialogTitle>
          <p className="text-center text-zinc-500 text-lg font-light">
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
                "cursor-pointer p-8 rounded-xl border transition-all duration-200 relative bg-white",
                selectedPlan === 'monthly'
                  ? "border-black ring-1 ring-black shadow-sm"
                  : "border-zinc-200 hover:border-zinc-400"
              )}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-black">Mensal</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-black">R$ 20</span>
                  <span className="text-zinc-500">/mês</span>
                </div>
                <p className="text-sm text-zinc-500 font-light">Faturamento mensal. Cancele a qualquer momento.</p>

                {selectedPlan === 'monthly' && (
                  <div className="absolute top-4 right-4 text-black">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>

            {/* Annual Plan - Recommended Style */}
            <div
              onClick={() => setSelectedPlan('annual')}
              className={cn(
                "cursor-pointer p-8 rounded-xl border transition-all duration-200 relative bg-white",
                selectedPlan === 'annual'
                  ? "border-black ring-1 ring-black shadow-md"
                  : "border-zinc-200 hover:border-zinc-400"
              )}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-xs font-medium tracking-wide uppercase">
                Recomendado
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-black">Anual</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-black">R$ 120</span>
                  <span className="text-zinc-500">/ano</span>
                </div>
                <p className="text-sm text-zinc-500 font-light">
                  Equivalente a <span className="font-medium text-black">R$ 10/mês</span>. Economize 50%.
                </p>
                 {selectedPlan === 'annual' && (
                  <div className="absolute top-4 right-4 text-black">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>
          </div>

           {/* Benefits */}
           <div className="space-y-4 pt-4">
            <h4 className="font-medium text-sm text-zinc-400 uppercase tracking-wider text-center mb-4">
              O que está incluído
            </h4>
            <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-black" />
                    <p className="text-sm font-normal text-zinc-700">{benefit.text}</p>
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
              className={cn(
                "w-full h-12 text-base font-medium rounded-lg shadow-sm border transition-all",
                "bg-black text-white hover:bg-black/90 border-transparent"
              )}
            >
              {isUpgrading ? "Processando..." : "Assinar Agora"}
            </Button>
            <p className="text-center text-xs text-zinc-400 font-light">
              Pagamento seguro processado via Stripe. Reembolso garantido em até 7 dias.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
