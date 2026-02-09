import React, { useState } from 'react';
import { MetricsProvider } from './context/MetricsContext';
import Dashboard from './pages/Dashboard';
import UpdateForm from './components/UpdateForm';
import { LayoutDashboard, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'settings'>('dashboard');

  return (
    <MetricsProvider>
      <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
        
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-2">
                {/* Logo Representation */}
                <div className="w-9 h-9 border-2 border-brand-black rounded-full flex items-center justify-center">
                  <span className="font-bold text-brand-black text-sm tracking-tighter leading-none pb-0.5">go</span>
                </div>
                <span className="text-2xl font-medium text-brand-black tracking-tight">
                  coffee
                </span>
              </div>
              
              <div className="flex items-center space-x-2 md:space-x-4">
                <button
                  onClick={() => setView('dashboard')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs md:text-sm font-medium transition ${
                    view === 'dashboard' 
                      ? 'bg-orange-50 text-brand-orange' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline">Dashboard</span>
                </button>
                <button
                  onClick={() => setView('settings')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs md:text-sm font-medium transition ${
                    view === 'settings' 
                      ? 'bg-orange-50 text-brand-orange' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Settings size={18} />
                  <span className="hidden md:inline">Atualizar Dados</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          {view === 'dashboard' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Dashboard />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <UpdateForm />
            </div>
          )}
        </main>
      </div>
    </MetricsProvider>
  );
};

export default App;
