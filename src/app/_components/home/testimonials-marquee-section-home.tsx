import { cn } from "@/app/_lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { Card, CardContent } from "../ui/card";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Maria Silva",
    body: "Perdi 8kg em 3 meses usando a Magalee no dia a dia.",
    meta: "Perdeu 8kg",
  },
  {
    name: "João Santos",
    body: "Finalmente consegui ganhar massa muscular de forma saudável.",
    meta: " Ganhou 5kg de massa",
  },
  {
    name: "Ana Costas",
    body: "A IA é muito precisa e me ajuda a manter uma alimentação equilibrada",
    meta: "Melhorou a saúde",
  },
  {
    name: "Lucas Ferreira",
    body: "Consegui regular minha alimentação e ter muito mais energia nos treinos.",
    meta: "Mais energia",
  },
  {
    name: "Carla Mendes",
    body: "Nunca tinha conseguido manter disciplina na dieta, agora virou hábito.",
    meta: "Disciplina alimentar",
  },
  {
    name: "Pedro Rocha",
    body: "Melhorei meu desempenho no CrossFit e estou mais motivado que nunca.",
    meta: "Mais performance",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  meta,
  name,
  body,
}: {
  meta: string;
  name: string;
  body: string;
}) => {
  return (
    <Card
      className={cn(
        "relative h-full w-80 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <CardContent className="p-6">
        <div className="mb-4 flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
          ))}
        </div>
        <p className="text-muted-foreground mb-4">&quot;{body}&quot;</p>
        <div className="flex items-center">
          <div className="bg-primary/10 mr-3 flex h-10 w-10 items-center justify-center rounded-full">
            <p className="text-primary">{name.charAt(0)}</p>
          </div>
          <div>
            <p className="text-foreground font-semibold">{name}</p>
            <p className="text-muted-foreground text-sm">{meta}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function TestimonialsMarqueeSectionHome() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <div className="mb-16 text-center">
        <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
          Não acredite apenas nas nossas palavras
        </h2>
        <p className="text-muted-foreground text-lg">
          Veja alguns de nossos clientes incríveis que estão tendo resultados
        </p>
      </div>
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  );
}
