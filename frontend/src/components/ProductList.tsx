import { Product } from '../types';
import ProductCard from './ProductCard';

interface Props {
  products: Product[];
  onChange: (updated: Product) => void;
  onDelete: (id: string) => void;
  highlightedId: string | null;
}

export default function ProductList({ products, onChange, onDelete, highlightedId }: Props) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3 opacity-20">◻</p>
        <p className="text-sm text-[#898989]">
          Añade productos pegando una URL de Amazon, AliExpress o IKEA.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onChange={onChange} onDelete={onDelete} highlighted={p.id === highlightedId} />
      ))}
    </div>
  );
}
