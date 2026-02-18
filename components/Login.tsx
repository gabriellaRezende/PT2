
import React, { useState } from 'react';
import { User as UserIcon, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (id: string, pass: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simular latência de rede
    setTimeout(() => {
      onLogin(id, pass);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-blue-700 flex flex-col justify-center items-center p-6 text-white max-w-md mx-auto">
      <div className="mb-12 text-center">
        <div className="bg-white p-4 rounded-2xl inline-block mb-4 shadow-2xl transform -rotate-3">
          <img 
            src="https://www.istec.pt/wp-content/uploads/2018/10/logo_istec_p-300x127.png" 
            alt="ISTEC Logo" 
            className="h-16 object-contain" 
          />
        </div>
        <h1 className="text-3xl font-bold mb-2">Portal Académico</h1>
        <p className="text-blue-100 opacity-80">Faça login para gerir as suas presenças</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="relative">
          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={20} />
          <input
            type="text"
            placeholder="Nº de Estudante ou E-mail"
            className="w-full bg-blue-800/50 border border-blue-400/30 rounded-xl py-4 pl-12 pr-4 text-white placeholder-blue-300 focus:ring-2 focus:ring-white focus:outline-none transition-all"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={20} />
          <input
            type="password"
            placeholder="Palavra-passe"
            className="w-full bg-blue-800/50 border border-blue-400/30 rounded-xl py-4 pl-12 pr-4 text-white placeholder-blue-300 focus:ring-2 focus:ring-white focus:outline-none transition-all"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-blue-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 active:scale-[0.98] transition-all disabled:opacity-70"
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              Entrar <ArrowRight size={20} />
            </>
          )}
        </button>

        <p className="text-center text-sm text-blue-200 mt-4">
          Esqueceu-se da sua senha? <span className="underline cursor-pointer">Recuperar</span>
        </p>
      </form>
      
      <div className="mt-20 text-xs opacity-50 text-center">
        &copy; 2024 ISTEC Lisboa / Porto<br/>Check-in Digital v1.0.0
      </div>
    </div>
  );
};

export default Login;
