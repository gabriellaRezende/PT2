
import React from 'react';
import ReactDOM from 'react-dom/client';

const FlutterBridge = () => (
  <div style={{ 
    height: '100vh', display: 'flex', flexDirection: 'column', 
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A237E', 
    color: 'white', fontFamily: 'sans-serif', textAlign: 'center' 
  }}>
    <img src="https://www.istec.pt/wp-content/uploads/2018/10/logo_istec_p-300x127.png" alt="ISTEC" style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px', marginBottom: '20px' }} />
    <h1>Projeto Flutter Consolidado</h1>
    <p>O código React foi removido. Toda a lógica reside agora em ficheiros <b>.dart</b>.</p>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<FlutterBridge />);
