import { cn } from "@/app/_lib/utils";
import {
  ArcTimeline,
  ArcTimelineItem,
} from "@/components/magicui/arc-timeline";

import {
  CoffeeIcon,
  CupSodaIcon,
  FishIcon,
  IceCreamIcon,
  MilkIcon,
  SandwichIcon,
  UtensilsIcon,
} from "lucide-react";

const ArcTimelineSectionHome = () => {
  return (
    <ArcTimeline
      className={cn(
        "[--step-line-active-color:#00B39B] dark:[--step-line-active-color:#00B39B]",
        "[--step-line-inactive-color:#b1b1b1] dark:[--step-line-inactive-color:#737373]",
        "[--placeholder-line-color:#a1a1a1] dark:[--placeholder-line-color:#737373]",
        "[--icon-active-color:#555555] dark:[--icon-active-color:#d4d4d4]",
        "[--icon-inactive-color:#a3a3a3] dark:[--icon-inactive-color:#a3a3a3]",
        "[--time-active-color:#555555] dark:[--time-active-color:#d4d4d4]",
        "[--time-inactive-color:#a3a3a3] dark:[--time-inactive-color:#a3a3a3]",
        "[--description-color:#555555] dark:[--description-color:#d4d4d4]",
      )}
      data={TIMELINE}
      defaultActiveStep={{ time: "Manhã", stepIndex: 0 }}
      arcConfig={{
        circleWidth: 4500,
        angleBetweenMinorSteps: 0.4,
        lineCountFillBetweenSteps: 8,
        boundaryPlaceholderLinesCount: 50,
      }}
    />
  );
};
export default ArcTimelineSectionHome;

const TIMELINE: ArcTimelineItem[] = [
  {
    time: "Manhã",
    steps: [
      {
        icon: <CupSodaIcon width={20} height={20} />,
        content: "07:00 - Pré-café da manhã - Shake de proteína com aveia.",
      },
      {
        icon: <CoffeeIcon width={20} height={20} />,
        content:
          "09:00 - Café da manhã - Omelete com pão integral e café preto.",
      },
      {
        icon: <IceCreamIcon width={20} height={20} />,
        content: "10:30 - Lanche da manhã - Iogurte natural com granola.",
      },
    ],
  },
  {
    time: "Tarde",
    steps: [
      {
        icon: <UtensilsIcon width={20} height={20} />,
        content: "12:30 - Almoço - Arroz, feijão, frango grelhado e salada.",
      },
      {
        icon: <SandwichIcon width={20} height={20} />,
        content:
          "15:30 - Lanche da tarde - Sanduíche natural com suco de laranja.",
      },
    ],
  },
  {
    time: "Noite",
    steps: [
      {
        icon: <FishIcon width={20} height={20} />,
        content: "19:00 - Jantar - Peixe assado com legumes.",
      },
      {
        icon: <MilkIcon width={20} height={20} />,
        content: "22:00 - Ceia - Shake de proteína com banana.",
      },
    ],
  },
];
