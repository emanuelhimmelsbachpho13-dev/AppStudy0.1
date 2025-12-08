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
          {/* Logo - Text Based for Minimalist look */}
          <Link to="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
            AppStudy
          </Link>

          {/* Centered Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground font-semibold"
            >
              Início
            </NavLink>
            <NavLink
              to="/?mode=text" // Assuming we just direct to home for now as "Texto" usually means the input
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground font-semibold"
            >
              Texto
            </NavLink>
            <NavLink
              to="/blog"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground font-semibold"
            >
              Blog
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
                className="rounded-full px-4 border-primary/20 hover:bg-secondary hover:text-foreground"
              >
                Sair
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => setAuthModalOpen(true)}
              className="rounded-md px-5 font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-none"
            >
              Entrar
            </Button>
          )}
        </div>
      </header>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
};
