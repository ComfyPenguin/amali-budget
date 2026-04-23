import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api', productsRouter);

app.listen(PORT, () => {
  console.log(`Backend en http://localhost:${PORT}`);
});
