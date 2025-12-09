import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState } from "react";

const Pricing = () => {
  const { upgradePlan } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async (plan: 'monthly' | 'annual') => {
    setIsLoading(true);
    try {
      await upgradePlan(plan);
      toast.success("Plano atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar plano. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-foreground">
      <Header />

      <main className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-gradient-slim">
            Investimento simples.
          </h1>
          <p className="text-xl text-zinc-500 font-light">
            Comece grátis, faça o upgrade quando estiver pronto para dominar os estudos.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={cn("text-sm transition-colors", billingCycle === 'monthly' ? "text-black font-medium" : "text-zinc-400")}>Mensal</span>
            <button
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-14 h-7 bg-zinc-100 rounded-full border border-zinc-200 p-1 transition-colors hover:border-zinc-300 focus:outline-none focus:ring-1 focus:ring-black"
            >
              <div className={cn("w-5 h-5 bg-black rounded-full shadow-sm transition-transform", billingCycle === 'annual' ? "translate-x-7" : "translate-x-0")} />
            </button>
            <span className={cn("text-sm transition-colors", billingCycle === 'annual' ? "text-black font-medium" : "text-zinc-400")}>
              Anual <span className="text-xs text-green-600 font-medium ml-1">(-50%)</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white p-10 rounded-2xl border border-zinc-200 flex flex-col hover:border-zinc-300 transition-colors">
            <div className="mb-8">
              <h3 className="text-2xl font-medium mb-2">Basic</h3>
              <p className="text-zinc-500 font-light text-sm">Para quem está começando a jornada.</p>
            </div>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-light tracking-tight">R$ 0</span>
              <span className="text-zinc-400">/sempre</span>
            </div>

            <Button variant="outline" className="w-full h-12 text-base font-normal border-zinc-200 hover:bg-zinc-50 hover:text-black mb-10">
              Começar Agora
            </Button>

            <div className="space-y-4 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-4">O que está incluído</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-zinc-700 font-light">
                  <CheckCircle2 className="w-5 h-5 text-black stroke-[1.5]" />
                  <span>3 gerações de quiz por dia</span>
                </li>
                <li className="flex items-center gap-3 text-zinc-700 font-light">
                  <CheckCircle2 className="w-5 h-5 text-black stroke-[1.5]" />
                  <span>Uploads de até 5MB</span>
                </li>
                <li className="flex items-center gap-3 text-zinc-700 font-light">
                  <CheckCircle2 className="w-5 h-5 text-black stroke-[1.5]" />
                  <span>Acesso ao Blog</span>
                </li>
                 <li className="flex items-center gap-3 text-zinc-400 font-light line-through">
                  <X className="w-5 h-5 text-zinc-300 stroke-[1.5]" />
                  <span>Histórico ilimitado</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-black p-10 rounded-2xl border border-black flex flex-col text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 bg-white text-black text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
              Popular
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-medium mb-2">Pro</h3>
              <p className="text-zinc-400 font-light text-sm">Para estudantes sérios e profissionais.</p>
            </div>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-light tracking-tight">
                {billingCycle === 'annual' ? 'R$ 10' : 'R$ 20'}
              </span>
              <span className="text-zinc-500">/mês</span>
            </div>

             <Button
              onClick={() => handleUpgrade(billingCycle)}
              disabled={isLoading}
              className="w-full h-12 text-base font-medium bg-white text-black hover:bg-zinc-100 border-transparent mb-10"
            >
              {isLoading ? "Processando..." : (billingCycle === 'annual' ? "Assinar Anual (R$ 120)" : "Assinar Mensal")}
            </Button>

            <div className="space-y-4 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-4">Tudo do Basic, mais:</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-zinc-200 font-light">
                  <CheckCircle2 className="w-5 h-5 text-white stroke-[1.5]" />
                  <span>Gerações <strong>ilimitadas</strong></span>
                </li>
                <li className="flex items-center gap-3 text-zinc-200 font-light">
                  <CheckCircle2 className="w-5 h-5 text-white stroke-[1.5]" />
                  <span>Uploads de arquivos grandes (50MB)</span>
                </li>
                <li className="flex items-center gap-3 text-zinc-200 font-light">
                  <CheckCircle2 className="w-5 h-5 text-white stroke-[1.5]" />
                  <span>Histórico completo de quizzes</span>
                </li>
                <li className="flex items-center gap-3 text-zinc-200 font-light">
                  <CheckCircle2 className="w-5 h-5 text-white stroke-[1.5]" />
                  <span>Suporte prioritário via email</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
