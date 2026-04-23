import { useState, useEffect, useRef } from 'react';

export default function AliexpressSetup() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch('/api/setup/aliexpress')
      .then((r) => r.json())
      .then((d) => setConfigured(d.configured))
      .catch(() => setConfigured(false));

    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  async function startSetup() {
    setLoading(true);
    setMessage('');

    // Reset marker para que el polling funcione correctamente
    await fetch('/api/setup/aliexpress', { method: 'DELETE' });
    setConfigured(false);

    // Abre el navegador
    const res = await fetch('/api/setup/aliexpress', { method: 'POST' });
    const data = await res.json();
    setMessage(data.message);

    // Polling hasta que el usuario cierre el navegador y el marker exista
    pollRef.current = setInterval(async () => {
      const r = await fetch('/api/setup/aliexpress');
      const d = await r.json();
      if (d.configured) {
        setConfigured(true);
        setMessage('Sesión guardada. AliExpress ya está configurado.');
        setLoading(false);
        clearInterval(pollRef.current!);
      }
    }, 3000);
  }

  if (configured === null) return null;

  return (
    <div className={`mb-5 p-3 rounded-lg text-sm flex items-center justify-between gap-3 ${
      configured ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
    }`}>
      <div>
        {configured ? (
          <span className="text-green-700">AliExpress configurado — scrapeando con tu sesión.</span>
        ) : (
          <span className="text-amber-700">
            AliExpress no configurado. Inicia sesión para ver tus precios reales.
          </span>
        )}
        {message && (
          <p className="mt-1 text-gray-500 text-xs">
            {message} Haz clic en "Cuenta" → "Iniciar sesión" dentro del navegador y ciérralo cuando hayas terminado.
          </p>
        )}
      </div>

      <button
        onClick={startSetup}
        disabled={loading}
        className="shrink-0 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {loading ? 'Esperando...' : configured ? 'Reconectar' : 'Iniciar sesión'}
      </button>
    </div>
  );
}
