import React, { useEffect, useState } from "react";
import { getTheme, COMMON_STYLES } from "./theme";
import { TrendingUp, AlertTriangle, ShoppingCart, Package } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ManagerDashboard({ apiRequest, isDarkMode }) {
  const theme = getTheme(isDarkMode);

  const [summary, setSummary] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);

  const fetchDashboard = async () => {
    try {
      const [s, l, t, a] = await Promise.all([
        apiRequest(`${API_URL}/dashboard/summary`),
        apiRequest(`${API_URL}/dashboard/low-stock`),
        apiRequest(`${API_URL}/dashboard/top-products`),
        apiRequest(`${API_URL}/dashboard/active-orders`)
      ]);

      if (s.ok) setSummary(await s.json());
      if (l.ok) setLowStock(await l.json());
      if (t.ok) setTopProducts(await t.json());
      if (a.ok) setActiveOrders(await a.json());
    } catch (err) {
      console.error("Dashboard fetch failed", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  
    const interval = setInterval(fetchDashboard, 5000);
  
    return () => clearInterval(interval);
  }, []);

  if (!summary) {
    return <div className="p-10 text-center">Loading dashboard...</div>;
  }

  /* Kitchen load calculation (frontend only) */
  const KITCHEN_CAPACITY = 20;
  const kitchenLoad = Math.min(activeOrders.length / KITCHEN_CAPACITY, 1);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-3 gap-6">

        <div className={`${COMMON_STYLES.card(isDarkMode)} p-6 flex items-center gap-4`}>
          <div className="p-3 rounded-lg bg-green-500/10 text-green-400">
            <TrendingUp size={24}/>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide opacity-60">
              Today's Revenue
            </p>
            <h2 className="text-2xl font-semibold font-mono">
              ₹{summary.today_revenue}
            </h2>
          </div>
        </div>

        <div className={`${COMMON_STYLES.card(isDarkMode)} p-6 flex items-center gap-4`}>
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
            <ShoppingCart size={24}/>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide opacity-60">
              Orders Today
            </p>
            <h2 className="text-2xl font-semibold">
              {summary.today_orders}
            </h2>
          </div>
        </div>

        <div className={`${COMMON_STYLES.card(isDarkMode)} p-6 flex items-center gap-4`}>
          <div className="p-3 rounded-lg bg-orange-500/10 text-orange-400">
            <Package size={24}/>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide opacity-60">
              Active Orders
            </p>
            <h2 className="text-2xl font-semibold">
              {summary.active_orders}
            </h2>
          </div>
        </div>

      </div>


      {/* NEW WIDGETS ROW */}

      <div className="grid grid-cols-2 gap-6">

        {/* INVENTORY ALERTS */}

        <div className={`${COMMON_STYLES.card(isDarkMode)} p-6`}>

          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle size={18} className="text-orange-400"/>
            <h3 className="text-lg font-semibold">
              Inventory Alerts
            </h3>
          </div>

          {lowStock.length === 0 ? (
            <p className="text-sm opacity-70">
              All ingredients stocked properly.
            </p>
          ) : (
            <div className="space-y-3">

              {lowStock.map(i => (

                <div
                  key={i.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                >

                  <div>
                    <p className="font-medium">
                      {i.name}
                    </p>

                    <p className="text-xs opacity-70">
                      Minimum required: {i.min_stock}
                    </p>
                  </div>

                  <span className="font-mono text-red-400 font-semibold">
                    {i.current_stock}
                  </span>

                </div>

              ))}

            </div>
          )}

        </div>


        {/* KITCHEN LOAD */}

        <div className={`${COMMON_STYLES.card(isDarkMode)} p-6`}>

          <h3 className="text-lg font-semibold mb-5">
            Kitchen Load
          </h3>

          <div className="space-y-4">

            <div className="flex justify-between text-sm opacity-70">
              <span>Active Orders</span>
              <span className="font-mono">
                {activeOrders.length} / {KITCHEN_CAPACITY}
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden">

              <div
                className={`h-full ${
                  kitchenLoad < 0.5
                    ? "bg-green-500"
                    : kitchenLoad < 0.8
                    ? "bg-orange-500"
                    : "bg-red-500"
                }`}
                style={{
                  width: `${kitchenLoad * 100}%`
                }}
              />

            </div>

            <p className="text-xs opacity-60">
              Kitchen capacity indicator based on active orders
            </p>

          </div>

        </div>

      </div>


      {/* LOW STOCK TABLE */}

      <div className={`${COMMON_STYLES.card(isDarkMode)} p-6`}>
        <h3 className="text-lg font-semibold mb-5">
          Low Stock Ingredients
        </h3>

        {lowStock.length === 0 ? (
          <p className="text-sm opacity-70">Everything is stocked properly.</p>
        ) : (
          <table className="w-full text-sm">

            <thead className="text-xs uppercase opacity-60">
              <tr>
                <th className="py-3 text-left">Ingredient</th>
                <th className="py-3 text-left">Stock</th>
                <th className="py-3 text-left">Minimum</th>
              </tr>
            </thead>

            <tbody className={`divide-y ${isDarkMode ? "divide-zinc-800" : "divide-gray-200"}`}>

              {lowStock.map(i => (
                <tr key={i.id} className="hover:bg-white/5">

                  <td className="py-3 font-medium">
                    {i.name}
                  </td>

                  <td className="py-3 font-mono">
                    {i.current_stock}
                  </td>

                  <td className="py-3 text-red-400 font-mono">
                    {i.min_stock}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        )}
      </div>


      {/* TOP PRODUCTS */}

      <div className={`${COMMON_STYLES.card(isDarkMode)} p-6`}>
        <h3 className="text-lg font-semibold mb-5">
          Top Selling Products
        </h3>

        <table className="w-full text-sm">

          <thead className="text-xs uppercase opacity-60">
            <tr>
              <th className="py-3 text-left">Product</th>
              <th className="py-3 text-left">Sold</th>
            </tr>
          </thead>

          <tbody className={`divide-y ${isDarkMode ? "divide-zinc-800" : "divide-gray-200"}`}>

            {topProducts.map(p => (
              <tr key={p.product_id} className="hover:bg-white/5">

                <td className="py-3 font-medium">
                  {p.name}
                </td>

                <td className="py-3 font-mono">
                  {p.total_sold}
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>


      {/* ACTIVE ORDERS */}

      <div className={`${COMMON_STYLES.card(isDarkMode)} p-6`}>

        <h3 className="text-lg font-semibold mb-5">
          Active Orders
        </h3>

        <table className="w-full text-sm">

          <thead className="text-xs uppercase opacity-60">
            <tr>
              <th className="py-3 text-left">Token</th>
              <th className="py-3 text-left">Total</th>
              <th className="py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody className={`divide-y ${isDarkMode ? "divide-zinc-800" : "divide-gray-200"}`}>

            {activeOrders.map(o => (
              <tr key={o.id} className="hover:bg-white/5">

                <td className="py-3 font-mono font-semibold text-lg">
                  {o.token}
                </td>

                <td className="py-3 font-mono">
                  ₹{o.total_amount}
                </td>

                <td className="py-3">

                  <span
                    className={`px-2 py-1 text-xs rounded-md font-medium ${
                      o.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {o.status}
                  </span>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}