import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';
import authRoutes from './routes/auth.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/create-post', postRoutes);
app.use('/generate-image', dalleRoutes);
app.use('/auth', authRoutes);
app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello from DALL.E!',
  });
});

const PORT = process.env.PORT || 8080 ; 
const startServer = async () => {
  try {
    connectDB(process.env.CONNECTION_URL);
    app.listen(PORT, () => console.log(`Server Running in the Port  : http://localhost:${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
