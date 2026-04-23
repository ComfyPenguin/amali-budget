import { Product } from '../types';

interface Props {
  products: Product[];
}

export default function Summary({ products }: Props) {
  if (products.length === 0) return null;

  const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const units = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="mt-6 pt-5 border-t border-[#f5f5f5] dark:border-[#1a1a1a] flex justify-end">
      <div className="text-right">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#898989] mb-1">
          Total presupuesto
        </p>
        <p className="text-4xl font-bold text-[#242424] dark:text-white tracking-display">
          {total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
        </p>
        <p className="text-xs text-[#898989] mt-1">
          {products.length} referencia{products.length !== 1 ? 's' : ''} · {units} unidad{units !== 1 ? 'es' : ''}
        </p>
      </div>
    </div>
  );
}
