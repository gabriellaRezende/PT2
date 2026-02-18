
// O projeto foi convertido para Flutter (Dart).
// Consulte os arquivos .dart para o código fonte da aplicação mobile.
import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => (
  <div style={{ 
    height: '100vh', 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#1A237E', 
    color: 'white',
    fontFamily: 'sans-serif',
    textAlign: 'center',
    padding: '20px'
  }}>
    <img src="https://www.istec.pt/wp-content/uploads/2018/10/logo_istec_p-300x127.png" alt="ISTEC" style={{ backgroundColor: 'white', padding: '10px', borderRadius: '10px', marginBottom: '20px' }} />
    <h1>Projeto Flutter: Check-in Digital ISTEC</h1>
    <p>O código fonte foi convertido com sucesso para <b>Dart/Flutter</b>.</p>
    <p style={{ opacity: 0.7 }}>Consulte o ficheiro <code>main.dart</code> e as pastas <code>screens/</code> e <code>providers/</code> no explorador de ficheiros.</p>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
