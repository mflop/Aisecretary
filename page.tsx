import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 overflow-hidden">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
            <div className="space-y-8 max-w-xl">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Asistentul tău de afaceri cu AI
              </h1>
              <p className="text-xl text-muted-foreground">
                Gestionează clienții, trimite remindere, generează mesaje inteligente și emite facturi - totul într-un singur loc.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="px-8">Începe gratuit</Button>
                </Link>
                <Link href="/#features">
                  <Button size="lg" variant="outline" className="px-8">Află mai multe</Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl shadow-xl flex items-center justify-center">
              <div className="absolute inset-4 bg-background/80 backdrop-blur-sm rounded-lg border shadow-md p-6">
                <div className="h-full w-full bg-muted/50 rounded flex items-center justify-center">
                  <p className="text-center text-muted-foreground">Captură de ecran</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Funcționalități care îți dezvoltă afacerea
            </h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Tot ce ai nevoie pentru a gestiona clienții și a-ți dezvolta afacerea, alimentat de inteligență artificială.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={feature.title} className="card">
                <Card className="h-full border border-border/40 shadow-sm">
                  <CardHeader>
                    <div className="p-3 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Prețuri simple și transparente
            </h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Alege planul care se potrivește cel mai bine afacerii tale.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="card">
              <Card className="h-full border border-border/40 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Gratuit</CardTitle>
                  <div className="text-5xl font-bold mt-2">0 RON<span className="text-lg font-normal text-muted-foreground">/lună</span></div>
                  <CardDescription className="text-base mt-2">Perfect pentru afacerile mici care abia încep.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Până la 20 mesaje AI/lună
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Șabloane de mesaje de bază
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Remindere manuale pentru programări
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Import CSV
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Link href="/register" className="w-full">
                      <Button className="w-full py-6 text-base">Începe acum</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Pro Plan */}
            <div className="card">
              <Card className="h-full border-2 border-primary shadow-md">
                <CardHeader className="pb-4">
                  <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full w-fit mb-2">RECOMANDAT</div>
                  <CardTitle className="text-2xl">Pro</CardTitle>
                  <div className="text-5xl font-bold mt-2">100 RON<span className="text-lg font-normal text-muted-foreground">/lună</span></div>
                  <CardDescription className="text-base mt-2">Pentru afaceri în creștere care au nevoie de mai multă putere.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      500 mesaje AI/lună
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Generare avansată de mesaje cu AI
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Sistem de facturare și remindere
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Clienți și programări nelimitate
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Suport prioritar
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Link href="/register" className="w-full">
                      <Button className="w-full py-6 text-base" variant="default">Începe acum</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Iubit de afaceri ca a ta
            </h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Vezi ce spun clienții noștri despre AI Secretary.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.name} className="card">
                <Card className="h-full border border-border/40 shadow-sm">
                  <CardContent className="pt-8">
                    <div className="flex items-start space-x-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-medium leading-none">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="text-muted-foreground">{testimonial.content}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-xl bg-primary/10 p-8 md:p-12 lg:flex lg:items-center lg:justify-between">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
                Gata să-ți transformi afacerea?
              </h2>
              <p className="text-lg text-muted-foreground">
                Începe cu AI Secretary astăzi și vezi diferența.
              </p>
            </div>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <Link href="/register">
                <Button size="lg" className="px-8 py-6 text-base">Începe gratuit</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Features data
const features = [
  {
    title: "Gestionare clienți",
    description: "Păstrează evidența tuturor clienților într-un singur loc, cu profiluri detaliate și notițe.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    ),
  },
  {
    title: "Generare mesaje cu AI",
    description: "Creează mesaje personalizate pentru clienții tăi cu ajutorul inteligenței artificiale.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    ),
  },
  {
    title: "Calendar programări",
    description: "Programează întâlniri și trimite remindere automate clienților tăi.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
    ),
  },
  {
    title: "Integrare WhatsApp",
    description: "Trimite mesaje direct către clienții tăi prin WhatsApp cu un singur clic.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
    ),
  },
  {
    title: "Generare facturi",
    description: "Creează și trimite facturi profesionale către clienții tăi în câteva secunde.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
    ),
  },
  {
    title: "Securitate multi-tenant",
    description: "Păstrează-ți datele în siguranță cu arhitectură multi-tenant și control al accesului bazat pe roluri.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
    ),
  },
];

// Testimonials data
const testimonials = [
  {
    name: "Maria Ionescu",
    role: "Proprietar salon",
    content: "AI Secretary a transformat complet modul în care îmi administrez salonul. Reminderele automate au redus neprezentările cu 70%, iar clienții adoră mesajele personalizate.",
  },
  {
    name: "Dr. Andrei Popescu",
    role: "Medic dentist",
    content: "Ca dentist ocupat, aveam nevoie de o modalitate simplă de a gestiona programările și de a trimite remindere. Această aplicație face totul, iar mesajele generate de AI îmi economisesc foarte mult timp.",
  },
  {
    name: "Cristian Dumitrescu",
    role: "Service auto",
    content: "Doar funcția de generare a facturilor merită abonamentul. Clienții mei apreciază facturile profesionale, iar mie îmi place cât de ușor sunt de creat.",
  },
]; 