import express, { json } from 'express';

import dotenv from 'dotenv';
import { conntectDB } from './config/db.js';
import productRoutes from './routes/product.route.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT | 5000;

app.use(express.json()); // allow to accept josn data in the request boday   

app.use("/api/products", productRoutes);

app.listen(PORT,() => {
    conntectDB ();
    console.log('server start at http://localhost:'+ PORT)
})