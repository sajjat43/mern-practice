import express from "express";  
import { createProduct, deleteProduct, getProduct, updateProduct } from "../controller/product.controller.js";
import auth from "../middleware/Auth.js";

const router = express.Router();  // Initialize router first

// Apply middleware after initialization
router.use(auth);

// Define routes
router.get("/", getProduct);
router.post("/", createProduct);
router.delete("/delete/:id", deleteProduct);
router.put("/update/:id", updateProduct);

export default router;