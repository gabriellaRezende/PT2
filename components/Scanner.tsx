
import React, { useState, useEffect, useRef } from 'react';
import { CheckInRecord } from '../types';
import { ISTEC_COORDS, CHECKIN_RADIUS_METERS } from '../constants';
import { calculateDistance, getCurrentPosition } from '../utils/geo';
import { X, Camera, MapPin, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

interface ScannerProps {
  onSuccess: (record: CheckInRecord) => void;
  onCancel: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState<'scanning' | 'validating' | 'result'>('scanning');
  const [status, setStatus] = useState<string>('Aponte para o código na sala...');
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // NOTA TÉCNICA (Relatório): 
  // O acesso à câmara é gerido via navigator.mediaDevices.getUserMedia.
  // No React, solicitamos a permissão ao montar o componente. O estado de erro
  // lida com casos onde o utilizador nega a permissão ou o hardware está indisponível.
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Não foi possível aceder à câmara. Verifique as permissões.");
      }
    }

    if (step === 'scanning') startCamera();

    return () => {
      // Parar stream ao fechar
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [step]);

  /**
   * Lógica de validação Core: QR + GPS
   */
  const handleSimulateScan = async () => {
    setStep('validating');
    setError(null);
    setStatus('A validar localização...');

    try {
      // 1. Obter GPS (Geolocator equivalent)
      // O package geolocator no Flutter é aqui representado pela Geolocation API do HTML5.
      const coords = await getCurrentPosition();
      
      // 2. Lógica de Proximidade (Requirement: 100m)
      const distance = calculateDistance(coords, ISTEC_COORDS);
      
      console.log(`Distância calculada: ${distance.toFixed(2)}m`);

      // Pequeno atraso para feedback visual
      await new Promise(r => setTimeout(r, 1500));

      if (distance <= CHECKIN_RADIUS_METERS) {
        // Sucesso
        const record: CheckInRecord = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          locationName: 'Campus ISTEC - Sala de Aula',
          status: 'success'
        };
        onSuccess(record);
      } else {
        // Fora de raio
        setError("Localização Incorreta: Você está fora do campus (ISTEC).");
        setStep('result');
      }
    } catch (err: any) {
      setError(err.message || "Erro desconhecido na validação.");
      setStep('result');
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent z-10 text-white">
        <h2 className="font-bold flex items-center gap-2">
          <Camera size={20} /> Digital Check-in
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-white/20 rounded-full">
          <X size={24} />
        </button>
      </div>

      {/* Scanner Viewport */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {step === 'scanning' && (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            
            {/* Overlay de Guia */}
            <div className="relative z-10 w-64 h-64 border-2 border-white/50 rounded-3xl flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-blue-500 rounded-3xl animate-pulse"></div>
              <div className="text-white text-center p-4 bg-black/40 rounded-xl backdrop-blur-sm">
                 <p className="text-sm font-semibold">{status}</p>
              </div>
            </div>

            {/* Simular botão para fins de demonstração (como mobile_scanner faria via callback) */}
            <button 
              onClick={handleSimulateScan}
              className="mt-12 relative z-10 bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-xl hover:bg-blue-500 transition-colors"
            >
              Validar Check-in
            </button>
            
            {error && (
              <div className="mt-4 mx-4 p-3 bg-red-600 text-white rounded-lg text-sm text-center z-10">
                {error}
              </div>
            )}
          </>
        )}

        {step === 'validating' && (
          <div className="text-white text-center flex flex-col items-center gap-6">
            <Loader2 className="animate-spin text-blue-500" size={64} />
            <div>
              <h3 className="text-xl font-bold">{status}</h3>
              <p className="opacity-60 text-sm mt-2">Isto pode demorar alguns segundos...</p>
            </div>
          </div>
        )}

        {step === 'result' && error && (
          <div className="mx-6 bg-white rounded-3xl p-8 text-center space-y-4 max-w-xs animate-in fade-in zoom-in">
            <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Falha no Check-in</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {error === "Localização Incorreta: Você está fora do campus (ISTEC)." 
                ? "O seu GPS indica que não se encontra no ISTEC. Por favor, certifique-se que está na sala de aula."
                : error}
            </p>
            <button 
              onClick={() => setStep('scanning')}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
            >
              Tentar Novamente
            </button>
            <button 
              onClick={onCancel}
              className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold"
            >
              Voltar ao Início
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-8 bg-black/40 text-center text-white/50 text-xs">
        Certifique-se que tem o GPS ativado no seu dispositivo.
      </div>
    </div>
  );
};

export default Scanner;
