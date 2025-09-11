import { FaWhatsapp } from "react-icons/fa6";
import { Badge } from "../ui/badge";
import { Bot, Camera, Mic, Sparkles } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const WhatsappSectionHome = () => {
  return (
    <section
      id="whatsapp"
      className="bg-gradient-to-br from-green-50/50 to-green-100/30 px-4 py-20 sm:px-6 lg:px-8 dark:from-green-950/20 dark:to-green-900/10"
    >
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <FaWhatsapp className="mr-2 h-4 w-4" />
            WhatsApp Integration
          </Badge>
          <h2 className="text-foreground mb-6 text-4xl font-bold md:text-5xl">
            MAGALEE vive no seu WhatsApp
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
            Não precisa baixar app nem lembrar de abrir nada. MAGALEE está
            sempre disponível no WhatsApp, pronta para ajudar com sua
            alimentação 24/7.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900">
                <Camera className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-foreground mb-2 text-xl font-semibold">
                  Análise por imagem
                </h3>
                <p className="text-muted-foreground">
                  Tire uma foto da sua refeição e MAGALEE identifica
                  automaticamente todos os alimentos, calcula calorias,
                  macronutrientes e oferece dicas nutricionais personalizadas.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900">
                <Mic className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-foreground mb-2 text-xl font-semibold">
                  Processamento de áudio
                </h3>
                <p className="text-muted-foreground">
                  Grave um áudio descrevendo sua refeição naturalmente. MAGALEE
                  processa sua fala, identifica os alimentos mencionados e
                  registra automaticamente no seu diário nutricional.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900">
                <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-foreground mb-2 text-xl font-semibold">
                  Inteligência conversacional
                </h3>
                <p className="text-muted-foreground">
                  Converse naturalmente com MAGALEE. Faça perguntas sobre
                  nutrição, peça sugestões de refeições ou solicite relatórios.
                  Ela entende contexto e oferece respostas personalizadas.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="overflow-hidden border-0 bg-white shadow-2xl dark:bg-gray-900">
              <CardContent className="p-0">
                <div className="bg-primary flex items-center space-x-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                    <img src="/logo.svg" className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">MAGALEE</p>
                    <p className="text-sm text-green-100">online</p>
                  </div>
                </div>
                <div className="h-80 space-y-4 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-800">
                  <div className="flex justify-start">
                    <div className="max-w-xs rounded-2xl rounded-bl-md bg-white p-3 shadow-sm dark:bg-gray-700">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        Oi! Sou a MAGALEE 🌟 Sua nutricionista IA. Envie uma
                        foto da sua refeição que eu analiso para você!
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary max-w-xs rounded-2xl rounded-br-md p-3">
                      <p className="text-sm text-white">📸 [Foto do almoço]</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-xs rounded-2xl rounded-bl-md bg-white p-3 shadow-sm dark:bg-gray-700">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        Perfeito! Identifiquei: Arroz (150g), Feijão (100g),
                        Frango grelhado (120g), Salada mista (80g).
                        <br />
                        <br />
                        📊 Total: 485 calorias
                        <br />
                        🥩 Proteína: 35g | 🍞 Carboidrato: 52g | 🥑 Gordura: 12g
                        <br />
                        <br />
                        💡 Dica: Excelente equilíbrio! Considere adicionar
                        abacate para gorduras boas.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t bg-white p-4 dark:bg-gray-900">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Mic className="h-4 w-4" />
                    <span className="text-sm">Digite uma mensagem...</span>
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

export default WhatsappSectionHome;
