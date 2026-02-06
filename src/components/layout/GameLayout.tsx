import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface GameLayoutProps {
  children: ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative scanlines">
      <Header />
      <main className="pt-14 pb-20 min-h-screen">
        <div className="container mx-auto px-4 py-4 h-full">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
