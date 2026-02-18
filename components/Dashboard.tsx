
import React from 'react';
import { User, CheckInRecord } from '../types';
import { QrCode, MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface DashboardProps {
  user: User;
  onStartScan: () => void;
  recentCheckIn?: CheckInRecord;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onStartScan, recentCheckIn }) => {
  return (
    <div className="space-y-6">
      {/* Bem-vindo */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-2xl">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Olá, {user.name}</h2>
            <p className="text-sm text-gray-500">ID: {user.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
             <CheckCircle2 size={12} /> Matrícula Ativa
           </span>
        </div>
      </section>

      {/* CTA Check-in */}
      <button 
        onClick={onStartScan}
        className="w-full bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-3xl text-white shadow-lg shadow-blue-200 flex flex-col items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-transform"
      >
        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
          <QrCode size={48} />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold">Escanear QR Code</h3>
          <p className="text-blue-100 text-sm opacity-90">Valide a sua presença na aula agora</p>
        </div>
      </button>

      {/* Última Atividade */}
      <section>
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Clock size={20} className="text-blue-600" /> Atividade Recente
        </h3>
        {recentCheckIn ? (
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${recentCheckIn.status === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {recentCheckIn.status === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{recentCheckIn.locationName}</p>
                <p className="text-xs text-gray-500">
                  {recentCheckIn.timestamp.toLocaleDateString()} às {recentCheckIn.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs font-bold px-2 py-1 rounded ${recentCheckIn.status === 'success' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                {recentCheckIn.status === 'success' ? 'CONFIRMADO' : 'FALHOU'}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-xl p-8 text-center text-gray-400 border-2 border-dashed border-gray-200">
            Nenhuma atividade registada hoje.
          </div>
        )}
      </section>

      {/* Lembrete de Localização */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <MapPin className="text-blue-600 shrink-0" size={20} />
        <div className="text-sm text-blue-800">
          <p className="font-semibold">Lembrete de GPS</p>
          <p className="opacity-80">Para que o check-in seja válido, você deve estar dentro do campus do ISTEC (raio de 100m).</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
