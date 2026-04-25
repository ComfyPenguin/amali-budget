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
    await fetch('/api/setup/aliexpress', { method: 'DELETE' });
    setConfigured(false);
    const res = await fetch('/api/setup/aliexpress', { method: 'POST' });
    const data = await res.json();
    setMessage(data.message);

    pollRef.current = setInterval(async () => {
      const r = await fetch('/api/setup/aliexpress');
      const d = await r.json();
      if (d.configured) {
        setConfigured(true);
        setMessage('Sesión guardada correctamente.');
        setLoading(false);
        clearInterval(pollRef.current!);
      }
    }, 3000);
  }

  if (configured === null) return (
    <div className="p-3.5 rounded-xl bg-white dark:bg-[#1a1a1a] shadow-card h-[62px]" />
  );

  return (
    <div className="p-3.5 rounded-xl bg-white dark:bg-[#1a1a1a] shadow-card flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          {/* Indicador de estado */}
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${configured ? 'bg-[#242424] dark:bg-white' : 'bg-[#898989]'}`} />
          <span className="text-sm font-semibold text-[#242424] dark:text-white">
            AliExpress
          </span>
        </div>
        <p className="text-xs text-[#898989] pl-3.5">
          {configured
            ? 'Sesión activa — los precios corresponden a tu cuenta.'
            : 'Sin sesión. Inicia sesión para ver tus precios reales.'}
        </p>
        {message && (
          <p className="text-xs text-[#898989] pl-3.5 mt-1">
            {message}{' '}
            {loading && 'Haz clic en "Cuenta" → "Iniciar sesión" en el navegador y ciérralo al terminar.'}
          </p>
        )}
      </div>

      <button
        onClick={startSetup}
        disabled={loading}
        className="shrink-0 px-3 py-1.5 bg-[#242424] dark:bg-white text-white dark:text-[#242424] text-xs font-semibold rounded-lg hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {loading ? 'Esperando...' : configured ? 'Reconectar' : 'Iniciar sesión'}
      </button>
    </div>
  );
}
