import { Button } from "../ui/button";

const CtaSectionHome = () => {
  return (
    <section id="planos" className="bg-primary/5 px-4 py-20 sm:px-6 lg:px-8">
      <div className="container mx-auto text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-foreground mb-6 text-3xl font-bold md:text-4xl">
            Comece sua jornada de saúde hoje
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Junte-se a milhares de usuários que já transformaram sua alimentação
            com nossa IA.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Assinar agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5 bg-transparent"
            >
              Saiba mais
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSectionHome;
