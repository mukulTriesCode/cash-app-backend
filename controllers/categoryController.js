const Category = require("../models/Category");

const getCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await Category.find({ userId }).select("_id name");
    res.status(200).json(categories);
  } catch (err) {
    console.error("Get Categories Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { getCategories };
