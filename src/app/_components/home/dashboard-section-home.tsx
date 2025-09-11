import {
  Award,
  BarChart3,
  Calendar,
  PieChart,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const DashboardSectionHome = () => {
  return (
    <section id="dashboard" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <Badge className="bg-primary text-primary-foreground mb-4">
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard Inteligente
          </Badge>
          <h2 className="text-foreground mb-6 text-4xl font-bold md:text-5xl">
            Acompanhe seu progresso em tempo real
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
            Tenha acesso a um dashboard completo com todas as suas estatísticas,
            gráficos de evolução e insights personalizados da MAGALEE.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <Card className="from-primary/5 to-primary/10 border-primary/20 bg-gradient-to-br shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="text-primary h-5 w-5" />
                  <span>Dashboard Nutricional</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-white p-4 text-center dark:bg-gray-800">
                    <div className="text-2xl font-bold text-green-600">
                      1,847
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Calorias hoje
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-4 text-center dark:bg-gray-800">
                    <div className="text-2xl font-bold text-blue-600">
                      -2.3kg
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Este mês
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Proteína</span>
                    <span className="text-muted-foreground text-sm">
                      85g / 120g
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-red-500"
                      style={{ width: "71%" }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Carboidrato</span>
                    <span className="text-muted-foreground text-sm">
                      180g / 200g
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: "90%" }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Gordura</span>
                    <span className="text-muted-foreground text-sm">
                      45g / 60g
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-yellow-500"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
                  <h4 className="mb-2 flex items-center font-semibold">
                    <Zap className="text-primary mr-2 h-4 w-4" />
                    Insights da MAGALEE
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    &quot;Baseado no seu histórico, você consome 15% menos
                    proteína nos fins de semana. Que tal incluir ovos no café da
                    manhã de sábado? 🥚&quot;
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl">
                <TrendingUp className="text-primary h-6 w-6" />
              </div>
              <div>
                <h3 className="text-foreground mb-2 text-xl font-semibold">
                  Relatórios automáticos
                </h3>
                <p className="text-muted-foreground">
                  Todos os dados são salvos automaticamente no Google Sheets.
                  Solicite relatórios consolidados e MAGALEE gera gráficos
                  detalhados da sua evolução nutricional.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-foreground mb-2 text-xl font-semibold">
                  Análise inteligente
                </h3>
                <p className="text-muted-foreground">
                  MAGALEE analisa padrões alimentares, identifica deficiências
                  nutricionais e sugere ajustes personalizados baseados no seu
                  histórico e objetivos.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-foreground mb-2 text-xl font-semibold">
                  Conquistas e badges
                </h3>
                <p className="text-muted-foreground">
                  Ganhe badges por atingir metas, manter consistência e
                  desenvolver hábitos saudáveis. Gamificação que motiva!
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-foreground mb-2 text-xl font-semibold">
                  Integração Google Sheets
                </h3>
                <p className="text-muted-foreground">
                  Todos os seus dados são automaticamente organizados no Google
                  Sheets. Acesse planilhas detalhadas com histórico completo e
                  gere relatórios personalizados quando quiser.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSectionHome;
