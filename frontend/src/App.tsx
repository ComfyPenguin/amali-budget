import { useState, useEffect } from 'react';
import { Product } from './types';
import { getProducts } from './services/api';
import { useTheme } from './hooks/useTheme';
import Header from './components/Header';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import Summary from './components/Summary';
import AliexpressSetup from './components/AliexpressSetup';

export default function App() {
  const { theme, setTheme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((p) => setProducts([...p].reverse())).catch(console.error);
  }, []);

  function handleAdd(product: Product) {
    setProducts((prev) => [product, ...prev]);
  }

  function handleChange(updated: Product) {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  function handleDelete(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#0f0f0f]">
      <Header theme={theme} setTheme={setTheme} />
      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
        <ProductList products={products} onChange={handleChange} onDelete={handleDelete} />
        <div className="lg:sticky lg:top-[88px] flex flex-col gap-3">
          <AliexpressSetup />
          <AddProduct onAdd={handleAdd} />
          <Summary products={products} />
        </div>
      </main>
    </div>
  );
}
