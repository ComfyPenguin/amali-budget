import { Product } from '../types';
import ProductCard from './ProductCard';

interface Props {
  products: Product[];
  onChange: (updated: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductList({ products, onChange, onDelete }: Props) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-5xl mb-3">🛒</p>
        <p className="text-sm">Añade productos pegando una URL de Amazon o AliExpress.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onChange={onChange} onDelete={onDelete} />
      ))}
    </div>
  );
}
