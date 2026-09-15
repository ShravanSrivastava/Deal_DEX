const calculatePriceScore = (product) => {
    if (!product || !product.prices || product.prices.length === 0) {
        return 0;
    }

    const prices = product.prices.map((item) => item.price);

    const highestPrice = Math.max(...prices);
    const lowestPrice = Math.min(...prices);

    if (highestPrice === lowestPrice) {
        return 100;
    }

    return ((highestPrice - lowestPrice) / highestPrice) * 100;
};


const calculateRatingScore = (product) => {
    if (!product || !product.rating) {
        return 0;
    }

    return (product.rating / 5) * 100;
};


const calculateAIScore = (priceScore, sentimentScore, ratingScore) => {
    return (
        0.40 * priceScore +
        0.40 * sentimentScore +
        0.20 * ratingScore
    );
};


const getRecommendation = (aiScore) => {
    if (aiScore >= 70) {
        return "BUY";
    }

    if (aiScore >= 40) {
        return "CONSIDER";
    }

    return "AVOID";
};


module.exports = {
    calculatePriceScore,
    calculateRatingScore,
    calculateAIScore,
    getRecommendation
};