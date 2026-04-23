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
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#0f0f0f]">
      <Header theme={theme} setTheme={setTheme} />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <AliexpressSetup />
        <AddProduct onAdd={handleAdd} />
        <ProductList products={products} onChange={handleChange} onDelete={handleDelete} />
        <Summary products={products} />
      </main>
    </div>
  );
}
