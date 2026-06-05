
import React from 'react';
import { NavItem } from '../types';
import { Shield, MessageCircle, BookOpen, Home, LogOut, ShieldCheck, MapPin, Award, MessageSquare } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: NavItem['id']) => void;
  user?: { nickname: string; isAnonymous: boolean } | null;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange, user, onLogout }) => {
  const items: { id: NavItem['id']; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Início', icon: <Home size={18} /> },
    { id: 'chat', label: 'Chat IA', icon: <MessageCircle size={18} /> },
    { id: 'diagnostico', label: 'Autoexame', icon: <ShieldCheck size={18} /> },
    { id: 'ubs', label: 'UBS Próximas', icon: <MapPin size={18} /> },
    { id: 'jogos', label: 'Jogos', icon: <Award size={18} /> },
    { id: 'comentarios', label: 'Mural/Chat', icon: <MessageSquare size={18} /> },
    { id: 'info', label: 'Educação', icon: <BookOpen size={18} /> },
    { id: 'safety', label: 'Segurança', icon: <Shield size={18} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-2 md:top-0 md:bottom-auto md:border-b md:border-t-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-14 gap-4 overflow-hidden">
        {/* Brand Logo - Styled precisely like the uploaded image */}
        <div className="hidden lg:block shrink-0" onClick={() => onTabChange('home')}>
          <Logo size="sm" />
        </div>

        {/* Navigation Middle Tab Menu - Horizontally scrollable and swipeable on mobile */}
        <div className="flex gap-1 md:gap-3 items-center overflow-x-auto select-none no-scrollbar py-1 w-full lg:w-auto scroll-smooth">
          <div className="flex gap-1 md:gap-2 pr-4 lg:pr-0">
            {items.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-purple-600 bg-purple-50/80 font-bold'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span className="text-[11px] md:text-xs font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* User Badge & Logout Option (Desktop only inside navbar) */}
        {user && (
          <div className="hidden md:flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-700">{user.nickname}</span>
              <span className="text-[9px] text-slate-400 font-medium">{user.isAnonymous ? 'Anônimo' : 'Perfil Privado'}</span>
            </div>
            <button
              onClick={onLogout}
              title="Sair da Conta"
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
