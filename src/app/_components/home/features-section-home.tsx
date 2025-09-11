import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  Activity,
  Apple,
  BarChart3,
  Brain,
  ChefHat,
  Clock,
  Heart,
  Target,
  TrendingUp,
} from "lucide-react";

const FeaturesSectionHome = () => {
  return (
    <section
      id="funcionalidades"
      className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
            Funcionalidades
          </h2>
          <p className="text-muted-foreground text-xl">
            Mais funcionalidades para facilitar sua vida
          </p>
          <p className="text-muted-foreground mt-2 text-lg">
            Além de registrar nutrientes através de fotos, áudios e textos, o
            NutriAI oferece:
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-card border-border hover:shadow-primary cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <Activity className="text-primary h-6 w-6" />
              </div>
              <CardTitle className="text-card-foreground">
                Registro de exercícios
              </CardTitle>
              <CardDescription>
                Registre seus exercícios para entender seu balanço calórico
                diário. Adicione atividades manualmente ou sincronize com seu
                relógio.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border hover:shadow-primary cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <TrendingUp className="text-primary h-6 w-6" />
              </div>
              <CardTitle className="text-card-foreground">
                Registro de medidas
              </CardTitle>
              <CardDescription>
                Registre e acompanhe seu peso, circunferência e dobras
                corporais. Visualize sua evolução por meio de gráficos
                detalhados.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border hover:shadow-primary cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <Heart className="text-primary h-6 w-6" />
              </div>
              <CardTitle className="text-card-foreground">
                Consumo de água
              </CardTitle>
              <CardDescription>
                Registre cada copo que você bebeu enviando pelo WhatsApp do
                NutriAI para controlar quantos litros de água você ingeriu.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border hover:shadow-primary cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <Target className="text-primary h-6 w-6" />
              </div>
              <CardTitle className="text-card-foreground">
                Defina metas
              </CardTitle>
              <CardDescription>
                Defina suas metas de macronutrientes e calorias e acompanhe
                diariamente se está atingindo.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border hover:shadow-primary cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <Brain className="text-primary h-6 w-6" />
              </div>
              <CardTitle className="text-card-foreground">
                Assistente com AI
              </CardTitle>
              <CardDescription>
                Faça perguntas, tire dúvidas, gere sugestões de alimentos e
                cardápios através da interação com o assistente.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border hover:shadow-primary cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <ChefHat className="text-primary h-6 w-6" />
              </div>
              <CardTitle className="text-card-foreground">
                Cadastre receitas
              </CardTitle>
              <CardDescription>
                Salve suas receitas através dos ingredientes e use de forma
                proporcional quando quiser.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border hover:shadow-primary cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <BarChart3 className="text-primary h-6 w-6" />
              </div>
              <CardTitle className="text-card-foreground">Relatórios</CardTitle>
              <CardDescription>
                Acompanhe relatórios de evolução, consumo de macronutrientes,
                calorias, peso, água e muito mais.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border hover:shadow-primary cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <Apple className="text-primary h-6 w-6" />
              </div>
              <CardTitle className="text-card-foreground">
                Receba avaliações
              </CardTitle>
              <CardDescription>
                Obtenha uma avaliação e estimativa do índice glicêmico, carga
                glicêmica ou colesterol de cada alimento registrado.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border hover:shadow-primary cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <Clock className="text-primary h-6 w-6" />
              </div>
              <CardTitle className="text-card-foreground">
                Lembretes personalizáveis
              </CardTitle>
              <CardDescription>
                Crie seu próprio lembrete e receba notificações diretamente via
                WhatsApp. Lembretes para água, medicamentos, refeições e etc.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSectionHome;
