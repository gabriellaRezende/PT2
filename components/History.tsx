
import React from 'react';
import { CheckInRecord } from '../types';
import { CheckCircle2, AlertCircle, MapPin, Calendar } from 'lucide-react';

interface HistoryProps {
  records: CheckInRecord[];
}

const History: React.FC<HistoryProps> = ({ records }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Meu Histórico</h2>
        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-bold">
          {records.length} registos
        </span>
      </div>

      {records.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <Calendar size={40} />
          </div>
          <p className="text-gray-500">Nenhuma presença confirmada ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div 
              key={record.id} 
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:border-blue-200 transition-colors"
            >
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                record.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {record.status === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-800 leading-tight">{record.locationName}</h4>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {record.status === 'success' ? 'Presença' : 'Erro'}
                  </span>
                </div>
                
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {record.timestamp.toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> ISTEC Lisboa
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nota técnica para o relatório */}
      <div className="mt-12 p-4 bg-gray-100 rounded-lg text-[10px] text-gray-400 italic">
        Nota para Relatório Técnico: Esta página utiliza uma ListView dinâmica mapeada a partir do estado global da aplicação. 
        Os dados são persistidos localmente para garantir que o aluno não perde o histórico ao fechar a App.
      </div>
    </div>
  );
};

export default History;
