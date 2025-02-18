import express, { json } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import productRoutes from './routes/product.route.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();   

app.use(express.json()); // allow to accept json data in the request body   

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log('server start at http://localhost:' + PORT)
});