import { ArrowRight, Camera, Mic } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const AboutAISectionHome = () => {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="mb-20 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-foreground mb-6 text-3xl font-bold md:text-4xl">
              MAGALEE entende fotos, áudios e textos
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Envie sua refeição de qualquer forma - foto, áudio ou texto. Nossa
              IA processa através de webhooks inteligentes, identifica
              automaticamente os alimentos e registra tudo no seu diário
              nutricional.
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Assine agora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="bg-muted mb-4 flex h-48 items-center justify-center rounded-lg">
                  <Camera className="text-muted-foreground h-12 w-12" />
                </div>
                <p className="text-muted-foreground text-center">
                  Envie uma foto da sua refeição
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-20 grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="bg-muted mb-4 flex h-48 items-center justify-center rounded-lg">
                  <Mic className="text-muted-foreground h-12 w-12" />
                </div>
                <p className="text-muted-foreground text-center">
                  Grave um áudio descrevendo sua refeição
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-foreground mb-6 text-3xl font-bold md:text-4xl">
              Processamento inteligente multimodal
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              MAGALEE processa mensagens através do Input Message Router,
              normaliza diferentes formatos (áudio, texto, imagem) e utiliza IA
              avançada para interpretar e catalogar suas refeições
              automaticamente.
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Assine agora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-foreground mb-6 text-3xl font-bold md:text-4xl">
              Dashboard com dados do Google Sheets
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Todos os dados processados pela MAGALEE são automaticamente salvos
              no Google Sheets. Visualize gráficos consolidados, acompanhe
              tendências e solicite relatórios detalhados diretamente pelo
              WhatsApp.
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Assine agora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="mb-4 text-center">
                  <div className="text-primary mb-2 text-3xl font-bold">
                    -350 cal
                  </div>
                  <p className="text-muted-foreground">Saldo calórico hoje</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Consumidas</span>
                    <span className="text-foreground">1,650 cal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Queimadas</span>
                    <span className="text-foreground">2,000 cal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAISectionHome;
