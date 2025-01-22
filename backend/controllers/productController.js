import Product from "../models/productModel.js";

export const getAllProducts = async (req, res) => {
    try {
       const products = await Product.find({}); // find all products
        res.json(products);
    } catch (error) {
        console.log("Error in getAllProducts: ", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};