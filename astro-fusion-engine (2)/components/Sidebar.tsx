import React from 'react';

interface Props {
  currentView: 'dashboard' | 'quizzes';
  onNavigate: (view: 'dashboard' | 'quizzes') => void;
}

export const Sidebar: React.FC<Props> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', icon: '◉', label: 'Dashboard' },
    { id: 'profile', icon: '👤', label: 'Profil' }, // Placeholder
    { id: 'quizzes', icon: '☾', label: 'Quizzes' },
    { id: 'agents', icon: '✦', label: 'Agenten' }, // Placeholder
    { id: 'premium', icon: '⚛', label: 'Premium' }, // Placeholder
  ];

  return (
    <div className="w-20 md:w-64 bg-[#1a1a1a] min-h-screen text-white flex flex-col items-center md:items-start py-8 md:px-6 fixed left-0 top-0 z-50 transition-all duration-300">
      <div className="mb-12 font-serif text-2xl tracking-wider md:pl-2">
        <span className="hidden md:inline">ASTRO</span>
        <span className="md:hidden">A</span>
      </div>
      
      <div className="flex flex-col gap-6 w-full">
        {menuItems.map((item) => (
          <div 
            key={item.id}
            onClick={() => {
              if (item.id === 'dashboard' || item.id === 'quizzes') {
                onNavigate(item.id as 'dashboard' | 'quizzes');
              }
            }}
            className={`flex items-center gap-4 cursor-pointer p-2 rounded transition-all duration-300 ${
              (currentView === item.id) 
                ? 'bg-astro-gold text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="hidden md:inline font-sans text-xs tracking-widest uppercase">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto space-y-4 w-full">
        <div className="flex items-center gap-4 text-gray-400 p-2 cursor-pointer hover:text-white">
          <span>⚙</span>
          <span className="hidden md:inline font-sans text-xs tracking-widest uppercase">Settings</span>
        </div>
        <div className="flex items-center gap-4 text-gray-400 p-2 cursor-pointer hover:text-white">
          <span>☾</span>
          <span className="hidden md:inline font-sans text-xs tracking-widest uppercase">Night Mode</span>
        </div>
      </div>
    </div>
  );
};