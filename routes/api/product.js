const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");
const { ObjectId } = require("mongodb");

//Insert Product
router.post("/create", async (req, res) => {
  const {
    title,
    description,
    price,
    promotionalPrice,
    images,
    category,
    store
  } = req.body;
  try {
    let product = null;
    product = new Product({
      title: title,
      description: description,
      price: price,
      promotionalPrice: promotionalPrice,
      category: category,
      store: store
    });
    images.forEach((image) => {
      product.images.push(image);
    });
    await product.save();
    return res.json({ msg: "Product Added", product });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//Get All Product
// router.get("/", async (req, res) => {
//     try {
//         const product = await Product.find().populate('category').populate('brand').populate('subCategory').sort({"title":1})

//         if (product.length > 0) {
//             return res.json({ product })
//         } else {
//             return res.json({ msg: 'No Products Found' })
//         }
//     } catch (err) {
//         console.log(err.message)
//         res.status(500).send("Server error")
//     }
// })

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    if (products.length > 0) {
      return res.json({ products });
    } else {
      return res.json({ msg: "No Products Found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//Delete Product
router.post("/delete", async (req, res) => {
  try {
    const { id } = req.body;
    const prod = await Product.findById(ObjectId(id));
    if (prod) {
      const product = await Product.findByIdAndDelete(ObjectId(id));
      return res.json({ msg: "Product Deleted", product });
    } else {
      return res.json({ msg: "No Product Found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//Update Product
router.post("/update", async (req, res) => {
  try {
    const { id, name, description, price, category } =
      req.body;

    let product = await Product.findOne({ _id: ObjectId(id) });
    console.log(product);
    if (!product) {
      return res.json({ msg: "No Product Found" });
    }
    product.name = name ? name : product.name;
    product.description = description ? description : product.description;
    product.price = price ? price : product.price;
    product.category = category ? category : product.category;
    product.store = store ? store : product.store;


    await product.save();
    return res.json({ msg: "Product Updated", product });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});


//Get Products By Category
router.get("/product-category", async (req, res) => {
  const { id } = req.body;
  try {
    const product = await Product.find({ category: { $eq: id } })
      .populate("category")
    if (product.length > 0) {
      return res.json({ product });
    } else {
      return res.json({ msg: "No Products Found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});


//Get Products By Store
router.get("/product-store", async (req, res) => {
  const { id } = req.body;
  try {
    const product = await Product.find({ store: { $eq: id } })
      .populate("store")
    if (product.length > 0) {
      return res.json({ product });
    } else {
      return res.json({ msg: "No Products Found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//Get Products By Store
router.get("/product-store-category/:storeid/:categoryid", async (req, res) => {
  const { storeid, categoryid } = req.params;
  try {
    const product = await Product.find({
      $and: [
        { store: { $eq: ObjectId(storeid) } },
        { category: { $eq: ObjectId(categoryid) } },
      ]
    })
      .populate("store").populate('category')
    if (product.length > 0) {
      return res.json({ product });
    } else {
      return res.json({ msg: "No Products Found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});


module.exports = router;