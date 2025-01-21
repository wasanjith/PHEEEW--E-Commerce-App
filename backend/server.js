import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


app.use("/api/auth", authRoutes);


app.listen(5000, () => {
    console.log("Server is running on http://localhost:" + PORT);

    connectDB();
});