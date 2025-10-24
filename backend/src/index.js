import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import falhasRouter from './routes/falhas.js';
import { initCloudinary } from './services/cloudinary.js';
// import { Falha } from '../models/Falha.js';



const app = express();
const PORT = process.env.PORT || 3001;

// middlewares
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));

// body parsers só para JSON comuns; uploads usam multer no route
app.use(express.json({ limit: '1mb' }));

// init serviços
await connectDB(process.env.MONGODB_URI);
initCloudinary({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET
});

// rotas
app.get('/', (_req, res) => res.send({ ok: true, name: 'cadeira-falhas-api' }));
app.use('/falhas', falhasRouter);

// start
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});
