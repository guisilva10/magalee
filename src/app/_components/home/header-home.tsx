import { useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Sparkles, Menu } from "lucide-react";
import Link from "next/link";

const HeaderHome = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <nav
      className={`supports-[backdrop-filter]:bg-background/60 bg-background/90 sticky z-50 mx-auto flex w-full items-center justify-between px-8 py-4 backdrop-blur transition-all duration-400 ease-in-out ${
        isScrolled
          ? "top-4 mx-4 h-16 max-w-4xl rounded-full border shadow-lg"
          : "top-4 h-18 max-w-full rounded-none"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? "h-12" : "h-16"}`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`from-primary to-primary/80 flex items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-all duration-500 ${
                isScrolled ? "h-8 w-8" : "h-10 w-10"
              }`}
            >
              <img
                src="/logo.svg"
                className={`text-primary-foreground transition-all duration-500 ${
                  isScrolled ? "h-4 w-4" : "h-5 w-5"
                }`}
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-foreground font-bold transition-all duration-500 ${
                  isScrolled ? "text-lg" : "text-xl"
                }`}
              >
                MAGALEE
              </span>
              <span
                className={`text-primary text-xs font-medium ${isScrolled ? "hidden" : "block"}`}
              >
                AI Nutricional
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            <a
              href="#funcionalidades"
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
              Funcionalidades
            </a>
            <a
              href="#whatsapp"
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
              WhatsApp
            </a>
            <a
              href="#dashboard"
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
              Dashboard
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            <Link href="/auth" className={buttonVariants({ variant: "ghost" })}>
              Entrar
            </Link>
            <Link
              href="/auth"
              className={buttonVariants({ variant: "default" })}
            >
              Começar Agora
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 px-6">
                <div className="mt-8 flex flex-col space-y-6">
                  {/* Logo no Sheet */}
                  <div className="flex items-center space-x-3 border-b pb-6">
                    <div className="from-primary to-primary/80 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg">
                      <Sparkles className="text-primary-foreground h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-foreground text-xl font-bold">
                        MAGALEE
                      </span>
                      <span className="text-primary text-xs font-medium">
                        AI Nutricional
                      </span>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex flex-col space-y-4">
                    <a
                      href="#funcionalidades"
                      className="text-foreground hover:text-primary hover:bg-muted rounded-lg px-4 py-2 font-medium transition-colors"
                      onClick={handleLinkClick}
                    >
                      Funcionalidades
                    </a>
                    <a
                      href="#whatsapp"
                      className="text-foreground hover:text-primary hover:bg-muted rounded-lg px-4 py-2 font-medium transition-colors"
                      onClick={handleLinkClick}
                    >
                      WhatsApp
                    </a>
                    <a
                      href="#dashboard"
                      className="text-foreground hover:text-primary hover:bg-muted rounded-lg px-4 py-2 font-medium transition-colors"
                      onClick={handleLinkClick}
                    >
                      Dashboard
                    </a>
                  </div>

                  {/* Auth Buttons */}
                  <div className="flex flex-col space-y-3 border-t pt-6">
                    <Link
                      href="/auth"
                      className={buttonVariants({
                        variant: "ghost",
                        className: "w-full justify-center",
                      })}
                      onClick={handleLinkClick}
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/auth"
                      className={buttonVariants({
                        variant: "default",
                        className: "w-full justify-center",
                      })}
                      onClick={handleLinkClick}
                    >
                      Começar Agora
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HeaderHome;
