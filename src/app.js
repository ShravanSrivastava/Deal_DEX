const productRoutes = require("./routes/product.routes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DealDex Backend is running",
  });
});

app.use("/api/products", productRoutes);
const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
  console.log(`DealDex server running on port ${PORT}`);
});
