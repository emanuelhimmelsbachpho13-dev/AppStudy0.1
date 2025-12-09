import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { NavLink } from "@/components/NavLink";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Header = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-8">
          {/* Logo - "Slim" Typography (font-medium instead of bold) */}
          <Link to="/" className="text-xl font-medium tracking-tight text-foreground hover:opacity-80 transition-opacity">
            AppStudy
          </Link>

          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              className="text-sm font-normal text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground font-medium"
            >
              Início
            </NavLink>
            <NavLink
              to="/?mode=text"
              className="text-sm font-normal text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground font-medium"
            >
              Texto
            </NavLink>
            <NavLink
              to="/blog"
              className="text-sm font-normal text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground font-medium"
            >
              Blog
            </NavLink>
            <button
              onClick={() => setContactOpen(true)}
              className="text-sm font-normal text-muted-foreground hover:text-foreground transition-colors"
            >
              Contato
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline-block">
                {user?.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="rounded-full px-4 border-zinc-200 hover:bg-secondary hover:text-foreground"
              >
                Sair
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => setAuthModalOpen(true)}
              className="rounded-md px-5 font-medium bg-black text-white hover:bg-black/90 shadow-none border border-transparent"
            >
              Entrar / Registrar
            </Button>
          )}
        </div>
      </header>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />

      {/* Contact Modal */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="max-w-md bg-white border border-zinc-200 shadow-sm rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium text-center mb-2">Fale Conosco</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center py-4">
            <p className="text-muted-foreground">
              Tem alguma dúvida ou sugestão? Envie um email para nossa equipe.
            </p>
            <a
              href="mailto:suporte@appstudy.com"
              className="inline-block text-lg font-medium text-black underline decoration-1 underline-offset-4 hover:opacity-70"
            >
              suporte@appstudy.com
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
