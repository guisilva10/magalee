import { useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import localFont from "next/font/local";
import { cn } from "@/app/_lib/utils";

const introFont = localFont({
  src: "../../fonts/intro-font.woff",
});

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
          <div className="flex items-center justify-between">
            <div
              className={`from-primary to-primary/80 flex items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-all duration-500 ${
                isScrolled ? "size-8" : "size-10"
              }`}
            >
              <img
                alt="Logo da magalee"
                src="/logo.svg"
                className={`text-primary-foreground transition-all duration-500 ${
                  isScrolled ? "size-5" : "size-8"
                }`}
              />
            </div>
            <span
              className={cn(
                "text-foreground ml-2 font-bold transition-all duration-500",
                [isScrolled ? "text-sm" : "text-lg", introFont.className],
              )}
            >
              MAGALEE
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            <a
              title="Funcionalidades"
              href="#funcionalidades"
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
              Funcionalidades
            </a>
            <a
              title="Whatsapp"
              href="#whatsapp"
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
              WhatsApp
            </a>
            <a
              title="Dashboard"
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
              href="/verify-number"
              className={buttonVariants({ variant: "default" })}
            >
              Começar Agora
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="bg-background relative flex md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex w-80 flex-col overflow-y-auto px-4 py-4"
              >
                <div className="mt-8 flex flex-col space-y-6">
                  {/* Logo no Sheet */}
                  <div className="flex items-center space-x-3 border-b pb-6">
                    <div className="from-primary to-primary/80 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg">
                      <img
                        src="/logo.svg"
                        className="text-primary-foreground h-5 w-5"
                      />
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
                      href="/verify-number"
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
