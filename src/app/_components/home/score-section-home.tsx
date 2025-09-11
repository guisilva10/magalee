import { NumberTicker } from "@/components/magicui/number-ticker";
import { Card, CardContent } from "../ui/card";

const ScoreSectionHome = () => {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold">
            MAGALEE em números
          </h2>
          <p className="text-muted-foreground text-lg">
            Resultados que falam por si só
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="from-primary/5 to-primary/10 border-primary/20 bg-gradient-to-br p-6 text-center">
            <CardContent className="p-0">
              <div className="text-primary mb-2 text-4xl font-bold">
                +<NumberTicker value={100} className="text-primary" />k
              </div>
              <p className="text-muted-foreground font-medium">
                Alimentos reconhecidos
              </p>
            </CardContent>
          </Card>
          <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10 p-6 text-center">
            <CardContent className="p-0">
              <div className="mb-2 text-4xl font-bold text-green-600">
                <NumberTicker value={5} className="text-green-600" />
                .2k kg
              </div>
              <p className="text-muted-foreground font-medium">
                Perdidos pelos usuários
              </p>
            </CardContent>
          </Card>
          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/10 p-6 text-center">
            <CardContent className="p-0">
              <div className="mb-2 text-4xl font-bold text-blue-600">
                <NumberTicker value={25} className="text-blue-600" />
                k+
              </div>
              <p className="text-muted-foreground font-medium">
                Usuários ativos
              </p>
            </CardContent>
          </Card>
          <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-purple-500/10 p-6 text-center">
            <CardContent className="p-0">
              <div className="mb-2 text-4xl font-bold text-purple-600">
                <NumberTicker value={98} className="text-purple-600" />%
              </div>
              <p className="text-muted-foreground font-medium">
                Satisfação dos usuários
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ScoreSectionHome;
