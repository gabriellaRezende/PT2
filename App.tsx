
import React, { useState, useEffect } from 'react';
import { AppScreen, User, CheckInRecord } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import History from './components/History';
import { MOCK_USER } from './constants';
import { LogOut, Home, QrCode, ClipboardList } from 'lucide-react';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<CheckInRecord[]>([]);

  // Carregar histórico inicial do localStorage se existir
  useEffect(() => {
    const saved = localStorage.getItem('istec_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed.map((item: any) => ({ ...item, timestamp: new Date(item.timestamp) })));
      } catch (e) {
        console.error("Erro ao carregar histórico", e);
      }
    }
  }, []);

  // Persistir histórico
  useEffect(() => {
    localStorage.setItem('istec_history', JSON.stringify(history));
  }, [history]);

  const handleLogin = (id: string, pass: string) => {
    // Simulação de login
    if (id && pass) {
      setUser(MOCK_USER);
      setScreen(AppScreen.DASHBOARD);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setScreen(AppScreen.LOGIN);
  };

  const addHistoryEntry = (record: CheckInRecord) => {
    setHistory(prev => [record, ...prev]);
  };

  if (!user || screen === AppScreen.LOGIN) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto shadow-xl relative overflow-hidden">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded">
             <img src="https://www.istec.pt/wp-content/uploads/2018/10/logo_istec_p-300x127.png" alt="ISTEC" className="h-6 object-contain" />
          </div>
          <h1 className="font-bold text-lg">Check-in Digital</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 hover:bg-blue-600 rounded-full transition-colors"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 p-4">
        {screen === AppScreen.DASHBOARD && (
          <Dashboard 
            user={user} 
            onStartScan={() => setScreen(AppScreen.SCANNER)} 
            recentCheckIn={history[0]}
          />
        )}
        {screen === AppScreen.SCANNER && (
          <Scanner 
            onSuccess={(record) => {
              addHistoryEntry(record);
              setScreen(AppScreen.DASHBOARD);
            }} 
            onCancel={() => setScreen(AppScreen.DASHBOARD)}
          />
        )}
        {screen === AppScreen.HISTORY && (
          <History records={history} />
        )}
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 flex justify-around p-2 safe-area-bottom z-50">
        <button 
          onClick={() => setScreen(AppScreen.DASHBOARD)}
          className={`flex flex-col items-center p-2 rounded-lg w-full ${screen === AppScreen.DASHBOARD ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Início</span>
        </button>
        <button 
          onClick={() => setScreen(AppScreen.SCANNER)}
          className={`flex flex-col items-center p-2 rounded-lg w-full ${screen === AppScreen.SCANNER ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <div className="bg-blue-600 text-white p-3 rounded-full -mt-8 shadow-lg">
            <QrCode size={28} />
          </div>
          <span className="text-xs mt-1">Check-in</span>
        </button>
        <button 
          onClick={() => setScreen(AppScreen.HISTORY)}
          className={`flex flex-col items-center p-2 rounded-lg w-full ${screen === AppScreen.HISTORY ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <ClipboardList size={24} />
          <span className="text-xs mt-1">Histórico</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
