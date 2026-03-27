import React from 'react';
import { 
  Home, 
  Building2, 
  Users, 
  FileText, 
  PackageCheck, 
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { View } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
  empresaNome: string;
}

const navItems: { view: View; label: string; icon: React.ElementType }[] = [
  { view: 'dashboard', label: 'Início', icon: Home },
  { view: 'empresa', label: 'Empresa', icon: Building2 },
  { view: 'clientes', label: 'Clientes', icon: Users },
  { view: 'recibos', label: 'Recibos', icon: FileText },
  { view: 'entrega', label: 'Entrega', icon: PackageCheck },
];

export function Layout({ children, currentView, onViewChange, empresaNome }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const NavContent = () => (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.view;
        return (
          <button
            key={item.view}
            onClick={() => {
              onViewChange(item.view);
              setMobileMenuOpen(false);
            }}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-amber-100 text-amber-900 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-amber-700' : 'text-gray-400'}`} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 leading-tight">Recibo</h1>
              <p className="text-xs text-gray-500">Alfombras</p>
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <NavContent />
        </div>
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">{empresaNome}</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-600 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">Recibo Alfombras</span>
        </div>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between py-4 border-b">
                <span className="font-bold">Menu</span>
              </div>
              <div className="flex-1 py-4">
                <NavContent />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-50 flex items-center justify-around px-2">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onViewChange(item.view)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all
                ${isActive ? 'text-amber-600' : 'text-gray-400'}
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
        <div className="p-4 lg:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
