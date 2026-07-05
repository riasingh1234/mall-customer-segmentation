import { useState } from "react";
import "./App.css";

function App() {
  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [spending, setSpending] = useState("");
  const [result, setResult] = useState("");
  const [customerPoint, setCustomerPoint] = useState(null);

  const segmentDetails = {
  "Budget Conscious": {
    description: "Customers with limited spending and price-sensitive behavior.",
    strategy: "Offer discounts, combo deals, and affordable products.",
    targetArea: "Discount Zone / Value Stores / Food Court Deals",
    products: "Budget Clothing, Grocery Combos, Discount Electronics",
  },

  "Affluent Spenders": {
    description: "High income customers with strong spending habits.",
    strategy: "Recommend premium brands and luxury shopping offers.",
    targetArea: "Luxury Brands / Premium Lounge / Designer Stores",
    products: "Luxury Watches, Premium Fashion, High-End Gadgets",
  },

  "High Potential Customers": {
    description: "Customers likely to become loyal premium buyers.",
    strategy: "Use personalized offers and loyalty programs.",
    targetArea: "Electronics / Lifestyle / Premium Fashion",
    products: "Smartphones, Watches, Luxury Apparel",
  },

  "Occasional Shoppers": {
    description: "Customers who shop infrequently with moderate spending.",
    strategy: "Increase engagement through promotions and campaigns.",
    targetArea: "General Stores / Seasonal Sale Zones",
    products: "Casual Wear, Home Essentials, Festival Offers",
  },

  "Value Seekers": {
    description: "Customers focused on getting maximum value for money.",
    strategy: "Promote deals, cashback, and seasonal offers.",
    targetArea: "Offer Zones / Cashback Stores / Combo Deals",
    products: "Discount Bundles, Cashback Products, Sale Items",
  },
};
  const predictCluster = async () => {
    try {
      const incomeInKUSD = Number(income) / 83 / 1000;

      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/predict`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      age: Number(age),
      income: incomeInKUSD,
      spending: Number(spending),
    }),
  }
);

      const data = await response.json();

      const segmentNames = {
        0: "Budget Conscious",
        1: "Affluent Spenders",
        2: "High Potential Customers",
        3: "Occasional Shoppers",
        4: "Value Seekers",
      };

      setResult(segmentNames[data.cluster]);
      setCustomerPoint({
        income: incomeInKUSD,
        spending: Number(spending),
      });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Customer Segmentation Dashboard</h1>

      {/* KPI Cards */}
      <div className="kpi-container">
        <div className="kpi-card">
          <h3>Total Customers</h3>
          <p>200</p>
        </div>

        <div className="kpi-card">
          <h3>Avg Income</h3>
          <p>₹6.5L</p>
        </div>

        <div className="kpi-card">
          <h3>Avg Spending</h3>
          <p>50</p>
        </div>

        <div className="kpi-card">
          <h3>Total Segments</h3>
          <p>5</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="main-section">
        <div className="card">
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <input
            type="number"
            placeholder="Annual Income (₹)"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />

          <input
            type="number"
            placeholder="Spending Score (1-100)"
            value={spending}
            onChange={(e) => setSpending(e.target.value)}
          />

          <button onClick={predictCluster}>Predict Segment</button>
        </div>

        {result !== "" && (
          <div className="result">
            <h2>{result}</h2>

            <p><strong>Description:</strong> {segmentDetails[result]?.description}</p>
            <p><strong>Strategy:</strong> {segmentDetails[result]?.strategy}</p>
            <p><strong>Target Area:</strong> {segmentDetails[result]?.targetArea}</p>
            <p><strong>Suggested Products:</strong> {segmentDetails[result]?.products}</p>
          </div>
        )}
      </div>

      {/* Chart */}
     {result && (
  <div className="chart-section">
    <h2>Customer Cluster Visualization</h2>
    <img src="/cluster_plot.png" alt="Cluster Plot" />

    {customerPoint && (
      <div className="customer-point-card">
        <h3>Your Position in Cluster</h3>
        <p><strong>Income:</strong> {customerPoint.income.toFixed(2)} k$</p>
        <p><strong>Spending Score:</strong> {customerPoint.spending}</p>
        <p>🔴 Represents your customer position in segmentation analysis</p>
      </div>
    )}
  </div>
)}
    </div>
  );
}

export default App;