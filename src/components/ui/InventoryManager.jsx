import React, { useEffect, useState } from "react";
import { Plus, Box, RefreshCw } from "lucide-react";
import { getTheme, COMMON_STYLES } from "./theme";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function InventoryManager({ apiRequest, isDarkMode }) {
  const theme = getTheme(isDarkMode);

  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newIngredient, setNewIngredient] = useState({
    name: "",
    unit: "",
    current_stock: "",
    min_stock: ""
  });

  const fetchIngredients = async () => {
    try {
      setLoading(true);

      const res = await apiRequest(`${API_URL}/ingredients/`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Failed to fetch");

      setIngredients(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // -----------------------------------------
  // CREATE INGREDIENT
  // -----------------------------------------
  const handleAddIngredient = async () => {
    if (!newIngredient.name || !newIngredient.unit) {
      alert("Name and unit required");
      return;
    }

    try {
      const res = await apiRequest(`${API_URL}/ingredients/`, {
        method: "POST",
        body: JSON.stringify({
          name: newIngredient.name,
          unit: newIngredient.unit,
          current_stock: Number(newIngredient.current_stock) || 0,
          min_stock: Number(newIngredient.min_stock) || 0
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Create failed");

      setNewIngredient({
        name: "",
        unit: "",
        current_stock: "",
        min_stock: ""
      });

      fetchIngredients();
    } catch (err) {
      alert(err.message);
    }
  };

  // -----------------------------------------
  // RESTOCK INGREDIENT
  // -----------------------------------------
  const handleRestock = async (id) => {
    const amount = prompt("Enter restock amount:");

    if (!amount || Number(amount) <= 0) return;

    try {
      const res = await apiRequest(
        `${API_URL}/ingredients/${id}/restock?amount=${Number(amount)}`,
        {
          method: "POST"
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Restock failed");

      fetchIngredients();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-8">Inventory Management</h2>

      {/* ADD INGREDIENT */}
      <div className={`${COMMON_STYLES.card(isDarkMode)} p-6 mb-8`}>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Plus size={16} /> Add Ingredient
        </h3>

        <div className="grid grid-cols-4 gap-4">
          <input
            placeholder="Name"
            className={COMMON_STYLES.input(isDarkMode)}
            value={newIngredient.name}
            onChange={(e) =>
              setNewIngredient({ ...newIngredient, name: e.target.value })
            }
          />

          <input
            placeholder="Unit (g, pcs, ml)"
            className={COMMON_STYLES.input(isDarkMode)}
            value={newIngredient.unit}
            onChange={(e) =>
              setNewIngredient({ ...newIngredient, unit: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Initial Stock"
            className={COMMON_STYLES.input(isDarkMode)}
            value={newIngredient.current_stock}
            onChange={(e) =>
              setNewIngredient({
                ...newIngredient,
                current_stock: e.target.value
              })
            }
          />

          <input
            type="number"
            placeholder="Min Stock"
            className={COMMON_STYLES.input(isDarkMode)}
            value={newIngredient.min_stock}
            onChange={(e) =>
              setNewIngredient({
                ...newIngredient,
                min_stock: e.target.value
              })
            }
          />
        </div>

        <button
          onClick={handleAddIngredient}
          className={`mt-4 px-4 py-2 rounded-lg ${theme.button.primary}`}
        >
          Add Ingredient
        </button>
      </div>

      {/* INGREDIENT TABLE */}
      <div className={`${COMMON_STYLES.card(isDarkMode)} overflow-hidden`}>
        <table className="w-full text-sm">
          <thead className={`${theme.bg.subtle}`}>
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Unit</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Min</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {ingredients.map((i) => {
              const lowStock = i.current_stock <= i.min_stock;

              return (
                <tr key={i.id} className="border-t">
                  <td className="p-4">{i.name}</td>

                  <td className="p-4">{i.unit}</td>

                  <td
                    className={`p-4 flex items-center gap-2 ${
                      lowStock ? "text-red-500 font-semibold" : ""
                    }`}
                  >
                    <Box size={14} />
                    {i.current_stock}
                  </td>

                  <td className="p-4">{i.min_stock}</td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleRestock(i.id)}
                      className="p-2 rounded-md hover:bg-blue-500/10"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}