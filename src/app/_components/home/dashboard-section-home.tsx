import { BarChart3 } from "lucide-react";
import { Badge } from "../ui/badge";
import Image from "next/image";

const DashboardSectionHome = () => {
  return (
    <section id="dashboard" className="relative px-4 sm:px-6 lg:px-8">
      <div className="relative container mx-auto">
        <div className="mb-16 py-12 text-center lg:py-20">
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

        <div className="relative mx-auto mt-12 w-full items-center py-12">
          <svg
            className="absolute inset-0 -mt-24 blur-3xl"
            style={{ zIndex: -1 }}
            fill="none"
            viewBox="0 0 400 400"
            height="100%"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_10_20)">
              <g filter="url(#filter0_f_10_20)">
                <path
                  d="M128.6 0H0V322.2L106.2 134.75L128.6 0Z"
                  fill="#00B39B"
                ></path>
                <path
                  d="M0 322.2V400H240H320L106.2 134.75L0 322.2Z"
                  fill="#00B39B"
                ></path>
                <path
                  d="M320 400H400V78.75L106.2 134.75L320 400Z"
                  fill="#00B39B"
                ></path>
                <path
                  d="M400 0H128.6L106.2 134.75L400 78.75V0Z"
                  fill="#00B39B"
                ></path>
              </g>
            </g>
            <defs>
              <filter
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="720.666"
                id="filter0_f_10_20"
                width="720.666"
                x="-160.333"
                y="-160.333"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feBlend
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  mode="normal"
                  result="shape"
                ></feBlend>
                <feGaussianBlur
                  result="effect1_foregroundBlur_10_20"
                  stdDeviation="80.1666"
                ></feGaussianBlur>
              </filter>
            </defs>
          </svg>

          <Image
            src="/dashboard-image-3.png"
            alt="imagem do dashboard de paciente"
            priority
            width={1200}
            height={800}
            className="relative w-full rounded-lg border object-cover shadow-2xl lg:rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardSectionHome;
