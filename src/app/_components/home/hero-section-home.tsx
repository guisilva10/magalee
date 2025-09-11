import { MessageCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { FaWhatsapp } from "react-icons/fa6";

const HeroSectionHome = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-4 py-32 sm:px-6 lg:px-8"
    >
      <div className="from-primary/20 via-background to-primary/10 absolute inset-0 bg-gradient-to-br"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="relative z-10 container mx-auto text-center">
        <div className="mx-auto max-w-5xl">
          <Badge className="bg-primary text-primary-foreground mb-6 px-4 py-2 text-sm font-medium">
            Conheça MAGALEE - Sua Nutricionista IA
          </Badge>
          <h1 className="text-foreground mb-8 text-5xl leading-tight font-bold text-balance md:text-7xl">
            Transforme sua{" "}
            <span className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-transparent">
              alimentação{" "}
            </span>
            com inteligência artificial
          </h1>
          <p className="text-muted-foreground mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-pretty md:text-xl">
            MAGALEE é sua nutricionista IA que entende fotos, áudios e textos
            das suas refeições. Com ela você recebe análises nutricionais
            instantâneas, dicas personalizadas e acompanhamento do seu progresso
            através do WhatsApp e de uma plataforma dashboard inteligente, que
            pode ser acompanhada pelo seu médico ou nutricionista.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-8 text-lg font-semibold shadow-xl transition-all duration-300 hover:shadow-2xl"
            >
              <FaWhatsapp className="size-5" />
              Falar com MAGALEE
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/20 text-foreground hover:bg-primary/5 border-2 bg-transparent px-10 py-7 text-lg font-medium"
            >
              Ver Demonstração
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionHome;
