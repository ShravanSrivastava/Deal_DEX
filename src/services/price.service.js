const getPricesForProduct = (product) => {
  if (!product || !product.prices) {
    return [];
  }

  return [...product.prices].sort((a, b) => a.price - b.price);
};

const getBestPrice = (product) => {
  const prices = getPricesForProduct(product);

  if (prices.length === 0) {
    return null;
  }

  return prices[0];
};

module.exports = {
  getPricesForProduct,
  getBestPrice,
};
