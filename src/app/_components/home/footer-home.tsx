import { Brain } from "lucide-react";

const FooterHome = () => {
  return (
    <footer className="bg-muted/30 border-border border-t px-4 py-12 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center space-x-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <Brain className="text-primary-foreground h-5 w-5" />
              </div>
              <span className="text-foreground text-xl font-bold">
                Magalee App
              </span>
            </div>
            <p className="text-muted-foreground">
              Transformando vidas através da nutrição inteligente.
            </p>
          </div>
          <div>
            <h3 className="text-foreground mb-4 font-semibold">Produto</h3>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <a
                  href="#funcionalidades"
                  className="hover:text-primary transition-colors"
                >
                  Funcionalidades
                </a>
              </li>
              <li>
                <a
                  href="#planos"
                  className="hover:text-primary transition-colors"
                >
                  Planos
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-foreground mb-4 font-semibold">Suporte</h3>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-foreground mb-4 font-semibold">Empresa</h3>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Termos
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-border text-muted-foreground mt-8 border-t pt-8 text-center">
          <p>&copy; 2025 Magalee App. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterHome;
