import express from 'express';
import { getAllProducts } from '../controllers/productController.js';
import { protectRoute, adminRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);


export default router;