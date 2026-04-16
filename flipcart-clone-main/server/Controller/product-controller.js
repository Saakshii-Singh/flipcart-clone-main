import Product from "../Model/productSchema.js";
import { Op } from "sequelize";

export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const where = {};

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      where[Op.or] = [
        { longTitle: { [Op.like]: term } },
        { shortTitle: { [Op.like]: term } },
        { brand: { [Op.like]: term } },
        { description: { [Op.like]: term } },
      ];
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    const data = await Product.findAll({ where, order: [['createdAt', 'DESC']] });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const data = await Product.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['category'],
      group: ['category'],
      order: [['category', 'ASC']],
    });
    const categories = products.map(p => p.category).filter(Boolean);
    res.status(200).json(['All', ...categories]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSimilarProducts = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const similar = await Product.findAll({
      where: {
        category: product.category,
        id: { [Op.ne]: product.id },
      },
      limit: 8,
    });

    res.status(200).json(similar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};