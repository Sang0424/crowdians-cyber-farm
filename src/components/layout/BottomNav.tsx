import { Home, GraduationCap, Compass } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/', icon: Home, label: 'Server Room' },
  { to: '/academy', icon: GraduationCap, label: 'Academy' },
  { to: '/adventure', icon: Compass, label: 'Adventure' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t-2 border-border safe-area-bottom">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="nav-pill"
              activeClassName="nav-pill-active"
              end={item.to === '/'}
            >
              {({ isActive }: { isActive: boolean }) => (
                <motion.div
                  className="flex flex-col items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                  <span className={`font-pixel text-[8px] ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {item.label}
                  </span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
