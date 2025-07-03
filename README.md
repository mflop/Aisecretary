# AI Secretary

An AI-powered secretary application for small service businesses, built with Next.js and Supabase.

## Features

- Client management with custom fields
- CSV import with automatic field mapping
- Invoice generation
- Appointment scheduling
- Message templates
- Dashboard with analytics

## Technologies Used

- Next.js 15
- React
- TypeScript
- Supabase (PostgreSQL)
- Tailwind CSS
- shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Supabase credentials
4. Run the development server:
   ```bash
   npm run dev
   ```

## License

MIT

## English

AI Secretary is a SaaS application designed for small service businesses (salons, clinics, garages, freelancers) in Romania who want to manage their clients, send appointment reminders, generate personalized messages using AI, and issue invoices.

### Features

- **Client Management**: Keep track of all your clients in one place
- **Calendar & Appointments**: Schedule appointments and send reminders
- **AI Message Generation**: Create personalized messages for your clients using OpenAI
- **WhatsApp Integration**: Send messages directly to clients via WhatsApp
- **Invoice System**: Create and download professional invoices
- **Multi-tenant Architecture**: Each company has its own secure data space

### Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS + Shadcn UI
- Supabase (Auth, Database, Storage)
- OpenAI GPT-4 API
- Stripe for subscriptions
- Framer Motion for animations

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Română

AI Secretary este o aplicație SaaS concepută pentru afaceri mici de servicii (saloane, clinici, service-uri auto, freelanceri) din România care doresc să-și gestioneze clienții, să trimită remindere pentru programări, să genereze mesaje personalizate folosind inteligența artificială și să emită facturi.

### Funcționalități

- **Gestionare Clienți**: Păstrează evidența tuturor clienților într-un singur loc
- **Calendar și Programări**: Programează întâlniri și trimite remindere
- **Generare Mesaje cu AI**: Creează mesaje personalizate pentru clienții tăi folosind OpenAI
- **Integrare WhatsApp**: Trimite mesaje direct către clienți prin WhatsApp
- **Sistem de Facturare**: Creează și descarcă facturi profesionale
- **Arhitectură Multi-tenant**: Fiecare companie are propriul spațiu de date securizat

### Stack Tehnologic

- Next.js 14 cu App Router
- TypeScript
- Tailwind CSS + Shadcn UI
- Supabase (Autentificare, Bază de date, Stocare)
- OpenAI GPT-4 API
- Stripe pentru abonamente
- Framer Motion pentru animații

### Cum să începi

1. Clonează repository-ul
2. Instalează dependențele: `npm install`
3. Configurează variabilele de mediu (vezi `.env.example`)
4. Rulează serverul de dezvoltare: `npm run dev`
5. Deschide [http://localhost:3000](http://localhost:3000) în browser

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
