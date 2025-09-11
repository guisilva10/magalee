import { Minus, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";

const FaqSectionHome = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  return (
    <section className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
            Perguntas frequentes
          </h2>
          <p className="text-muted-foreground text-lg">
            Tudo que você precisa saber sobre o NutriAI
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {[
            {
              question: "Como funciona o NutriAI?",
              answer:
                "O NutriAI revoluciona a maneira de monitorar a ingestão calórica diária, utilizando Inteligência Artificial integrada ao WhatsApp. Basta enviar uma foto do seu prato ou usar áudios descrevendo sua refeição, que a IA processará e adicionará automaticamente ao seu registro diário.",
            },
            {
              question: "Para quem é o NutriAI?",
              answer:
                "Para pessoas que desejam compreender facilmente quantas calorias consomem diariamente e controlar seu peso. Ideal para quem não tem tempo para usar aplicativos tradicionais e quer criar o hábito de forma prática.",
            },
            {
              question:
                "Como o NutriAI calcula o peso dos alimentos através de fotos?",
              answer:
                "Utilizamos tecnologia avançada de inteligência artificial treinada para reconhecer e analisar diferentes tipos de alimentos, proporcionando uma estimativa precisa do peso. Para precisão absoluta, oferecemos a opção de inserção manual.",
            },
            {
              question: "O NutriAI oferece planos de dieta personalizados?",
              answer:
                "O NutriAI é especializado na contagem e monitoramento de calorias e macronutrientes. Recomendamos consultar profissionais de nutrição para planos personalizados. Nosso objetivo é fornecer ferramentas que complementem uma rotina saudável.",
            },
            {
              question: "Como funciona o cancelamento?",
              answer:
                "Você pode solicitar reembolso completo dentro de 7 dias após a compra, sem burocracias. Assinantes no cartão podem cancelar a renovação automática a qualquer momento, sem multas ou taxas adicionais.",
            },
          ].map((faq, index) => (
            <Card key={index} className="bg-card border-border">
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleFaq(index)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-card-foreground text-left">
                    {faq.question}
                  </CardTitle>
                  {openFaq === index ? (
                    <Minus className="text-muted-foreground h-5 w-5" />
                  ) : (
                    <Plus className="text-muted-foreground h-5 w-5" />
                  )}
                </div>
              </CardHeader>
              {openFaq === index && (
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-foreground mb-4 text-xl font-bold">
            Ainda tem dúvidas?
          </h3>
          <p className="text-muted-foreground mb-6">
            Não consegue encontrar a resposta que procura? Fale com a gente!
          </p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Fale com a gente
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FaqSectionHome;
