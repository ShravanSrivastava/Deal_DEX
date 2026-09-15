const products = [
  {
    id: 1,
    name: "Apple iPhone 15",
    brand: "Apple",
    category: "Smartphone",
    rating: 4.5,
    prices: [
      {
        platform: "Amazon",
        price: 69999,
        url: "https://amazon.in",
      },
      {
        platform: "Flipkart",
        price: 68999,
        url: "https://flipkart.com",
      },
      {
        platform: "Croma",
        price: 70999,
        url: "https://croma.com",
      },
    ],
    reviews: [
      {
        user: "Rahul",
        rating: 5,
        comment: "Amazing phone with excellent camera and battery life.",
      },
      {
        user: "Aman",
        rating: 4,
        comment: "Performance is great but the price is slightly high.",
      },
      {
        user: "Priya",
        rating: 5,
        comment: "Very smooth performance and beautiful display.",
      },
    ],
  },
  {
    id: 2,
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    category: "Smartphone",
    rating: 4.4,
    prices: [
      {
        platform: "Amazon",
        price: 64999,
        url: "https://amazon.in",
      },
      {
        platform: "Flipkart",
        price: 63999,
        url: "https://flipkart.com",
      },
    ],
    reviews: [
      {
        user: "Neha",
        rating: 5,
        comment: "Excellent display and camera quality.",
      },
      {
        user: "Arjun",
        rating: 4,
        comment: "Good performance and battery, overall a great phone.",
      },
      {
        user: "Karan",
        rating: 3,
        comment: "Phone is good but battery could be better.",
      },
    ],
  },
];

module.exports = products;
