const products = require("../data/products");
const {
  calculatePriceScore,
  calculateRatingScore,
  calculateAIScore,
  getRecommendation,
} = require("../services/score.service");

const {
    getReviewsForProduct,
    getAverageReviewRating
} = require("../services/review.service");

const {
  getPricesForProduct,
  getBestPrice,
} = require("../services/price.service");


const getProducts = (req, res) => {
  res.json({
    success: true,
    count: products.length,
    products: products,
  });
};

const getProductById = (req, res) => {
  const id = parseInt(req.params.id);

  const product = products.find((product) => product.id === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.json({
    success: true,
    product: product,
  });
};

const getProductPrices = (req, res) => {
  const id = parseInt(req.params.id);

  const product = products.find((product) => product.id === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  const prices = getPricesForProduct(product);
  const bestPrice = getBestPrice(product);

  res.json({
    success: true,
    productId: product.id,
    productName: product.name,
    prices: prices,
    bestPrice: bestPrice,
  });
};

const getProductReviews = (req, res) => {
  const id = parseInt(req.params.id);

  const product = products.find((product) => product.id === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  const reviews = getReviewsForProduct(product);
  const averageRating = getAverageReviewRating(product);

  res.json({
    success: true,
    productId: product.id,
    productName: product.name,
    averageRating: averageRating,
    reviews: reviews,
  });
};

const analyzeProduct = (req, res) => {
  const id = parseInt(req.params.id);

  const product = products.find((product) => product.id === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Temporary mock sentiment score
  // Later this will come from the AI service
  const sentimentScore = 80;

  const priceScore = calculatePriceScore(product);
  const ratingScore = calculateRatingScore(product);

  const aiScore = calculateAIScore(priceScore, sentimentScore, ratingScore);

  const recommendation = getRecommendation(aiScore);

  res.json({
    success: true,

    product: {
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      rating: product.rating,
    },

    priceComparison: {
      prices: product.prices,
      bestPrice: product.prices.reduce((best, current) =>
        current.price < best.price ? current : best,
      ),
    },

    reviews: product.reviews,

    scores: {
      priceScore: Number(priceScore.toFixed(2)),
      sentimentScore: sentimentScore,
      ratingScore: Number(ratingScore.toFixed(2)),
      aiScore: Number(aiScore.toFixed(2)),
    },

    recommendation: recommendation,
  });
};

module.exports = {
  getProducts,
  getProductById,
  getProductPrices,
  getProductReviews,
  analyzeProduct,
};
