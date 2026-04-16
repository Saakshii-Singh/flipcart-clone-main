import Product from "./Model/productSchema.js";
import { products } from "./Constant/data.js";
import { Op } from "sequelize";

const DefaultData = async () => {
  try {
    // Get all valid product IDs from seed data
    const seedIds = products.map(p => p.id);

    // Remove any old products not in the current seed data
    await Product.destroy({
      where: {
        id: { [Op.notIn]: seedIds },
      },
    });

    // Upsert all products
    for (const product of products) {
      await Product.upsert(product);
    }
    console.log("Data inserted/updated successfully (" + products.length + " products)");
  } catch (error) {
    console.log("Error:", error);
  }
};

export default DefaultData;