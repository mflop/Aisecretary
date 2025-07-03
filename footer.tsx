import Link from 'next/link';

export function MarketingFooter() {
  return (
    <footer className="border-t bg-background/80">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              <span className="bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">AI Secretary</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Gestionare inteligentă a clienților pentru afaceri mici.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Produs</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Funcționalități
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Prețuri
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Companie</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Despre noi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Politica de confidențialitate
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Termeni și condiții
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AI Secretary. Toate drepturile rezervate.
        </div>
      </div>
    </footer>
  );
} 