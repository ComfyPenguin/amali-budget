import { Product } from '../types';

interface Props {
  products: Product[];
}

export default function Summary({ products }: Props) {
  if (products.length === 0) return null;

  const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const count = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="mt-6 pt-5 border-t border-gray-200 flex justify-end">
      <div className="text-right">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">
          Total presupuesto
        </p>
        <p className="text-4xl font-bold text-gray-900">
          {total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {products.length} referencia{products.length !== 1 ? 's' : ''} · {count} unidad
          {count !== 1 ? 'es' : ''}
        </p>
      </div>
    </div>
  );
}
