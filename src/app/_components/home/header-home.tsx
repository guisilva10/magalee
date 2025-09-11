import { useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const HeaderHome = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      className={`bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky z-50 mx-auto flex w-full items-center justify-between px-8 py-4 backdrop-blur transition-all duration-400 ease-in-out ${
        isScrolled
          ? "top-4 h-16 max-w-4xl rounded-full border shadow-lg"
          : "top-4 h-18 max-w-full rounded-none border-b"
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
              <Sparkles
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
          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </nav>
  );
};

export default HeaderHome;
