import { Product } from '../types';

interface Props {
  products: Product[];
}

export default function Summary({ products }: Props) {
  const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const units = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#1a1a1a] shadow-card">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-[#898989] mb-3">
        Total presupuesto
      </p>
      <p className="text-3xl font-bold text-[#242424] dark:text-white tracking-display leading-none">
        {total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
      </p>
      <p className="text-xs text-[#898989] mt-2">
        {products.length} referencia{products.length !== 1 ? 's' : ''} · {units} unidad{units !== 1 ? 'es' : ''}
      </p>
    </div>
  );
}
