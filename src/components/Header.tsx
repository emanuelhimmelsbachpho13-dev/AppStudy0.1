import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import jungleLogo from "@/assets/jungle-logo.png";

export const Header = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <>
      <header className="w-full py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={jungleLogo} alt="Jungle" className="h-10 w-auto" />
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="text-jungle-light">Olá, {user?.name}!</span>
              <Button variant="auth" size="default" onClick={logout}>
                Sair
              </Button>
            </>
          ) : (
            <Button variant="auth" size="default" onClick={() => setAuthModalOpen(true)}>
              Entrar / Cadastrar
            </Button>
          )}
        </div>
      </header>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
};
