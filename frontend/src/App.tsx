import { useState, useEffect } from 'react';
import { Product } from './types';
import { getProducts } from './services/api';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import Summary from './components/Summary';
import AliexpressSetup from './components/AliexpressSetup';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  function handleAdd(product: Product) {
    setProducts((prev) => [...prev, product]);
  }

  function handleChange(updated: Product) {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  function handleDelete(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Budget Tracker</h1>
          <p className="mt-1 text-sm text-gray-500">
            Pega links de Amazon o AliExpress para construir tu presupuesto.
          </p>
        </header>

        <AliexpressSetup />
        <AddProduct onAdd={handleAdd} />
        <ProductList products={products} onChange={handleChange} onDelete={handleDelete} />
        <Summary products={products} />
      </div>
    </div>
  );
}
