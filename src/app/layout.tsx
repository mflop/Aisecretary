import { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import { MarketingHeader } from '@/components/marketing/header';
import { MarketingFooter } from '@/components/marketing/footer';

export const metadata: Metadata = {
  title: 'AI Secretary - Smart Client Management for Small Businesses',
  description: 'Manage clients, send reminders, generate smart messages, and issue invoices with AI assistance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col">
          <MarketingHeader />
          <main className="flex-1">{children}</main>
          <MarketingFooter />
          <Toaster />
        </div>
      </body>
    </html>
  );
} 