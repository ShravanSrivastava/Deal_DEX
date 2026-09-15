const getReviewsForProduct = (product) => {
  if (!product || !product.reviews) {
    return [];
  }

  return product.reviews;
};

const getAverageReviewRating = (product) => {
  const reviews = getReviewsForProduct(product);

  if (reviews.length === 0) {
    return 0;
  }

  const total = reviews.reduce((sum, review) => {
    return sum + review.rating;
  }, 0);

  return total / reviews.length;
};

module.exports = {
  getReviewsForProduct,
  getAverageReviewRating,
};
