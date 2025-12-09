import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { NavLink } from "@/components/NavLink";

export const Header = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-8">
          {/* Logo - Image Replaces Text */}
          <Link to="/" className="hover:opacity-80 transition-opacity flex items-center">
            <img src="/logo.png" alt="AppStudy Logo" className="h-10 w-auto" />
          </Link>

          {/* Centered Navigation - Only "Início" */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              className="text-sm font-normal text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground font-medium"
            >
              Início
            </NavLink>
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
              variant="outline"
              size="sm"
              onClick={() => setAuthModalOpen(true)}
              className="rounded-md px-5 font-medium border border-black bg-transparent text-black hover:bg-zinc-50 shadow-none transition-colors"
            >
              Entrar / Registrar
            </Button>
          )}
        </div>
      </header>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
};
