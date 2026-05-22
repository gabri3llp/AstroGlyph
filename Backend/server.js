import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './Routes/auth.js';


dotenv.config();

const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  // Only allow requests from our React frontend URL.
  credentials: true,
}));

app.use(express.json());


app.use('/api/auth', authRoutes);


app.get('/api/health', (req, res) => {
  res.json({ message: 'AstroGlyph server is running! 🌌' });
});



mongoose
  .connect(process.env.MONGO_URI)


  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;


    app.listen(PORT, () => {

      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })

  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });