import { Star, Users } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const TestimonialsSectionHome = () => {
  return (
    <section className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
            Não acredite apenas nas nossas palavras
          </h2>
          <p className="text-muted-foreground text-lg">
            Veja alguns de nossos clientes incríveis que estão tendo resultados
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-current text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "Perdi 8kg em 3 meses usando o NutriAI. A facilidade de
                registrar pelo WhatsApp mudou minha vida!"
              </p>
              <div className="flex items-center">
                <div className="bg-primary/10 mr-3 flex h-10 w-10 items-center justify-center rounded-full">
                  <Users className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="text-foreground font-semibold">Maria Silva</p>
                  <p className="text-muted-foreground text-sm">Perdeu 8kg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-current text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "Finalmente consegui ganhar massa muscular de forma saudável. O
                app é incrível!"
              </p>
              <div className="flex items-center">
                <div className="bg-primary/10 mr-3 flex h-10 w-10 items-center justify-center rounded-full">
                  <Users className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="text-foreground font-semibold">João Santos</p>
                  <p className="text-muted-foreground text-sm">
                    Ganhou 5kg de massa
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-current text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "A IA é muito precisa e me ajuda a manter uma alimentação
                equilibrada todos os dias."
              </p>
              <div className="flex items-center">
                <div className="bg-primary/10 mr-3 flex h-10 w-10 items-center justify-center rounded-full">
                  <Users className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="text-foreground font-semibold">Ana Costa</p>
                  <p className="text-muted-foreground text-sm">
                    Melhorou a saúde
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSectionHome;
