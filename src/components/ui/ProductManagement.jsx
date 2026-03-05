import React, { useState } from "react";
import { Plus, Trash2, Edit2, Box } from "lucide-react";
import { getTheme, COMMON_STYLES, FONTS } from "./theme";

export default function ProductManagement({
  rawProducts,
  categories,
  isDarkMode,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const theme = getTheme(isDarkMode);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    stock: "",
    category: "",
  });

  const resetForm = () => {
    setForm({ id: null, name: "", price: "", stock: "", category: "" });
    setIsAdding(false);
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) {
      alert("Fill required fields");
      return;
    }

    if (isEditing) {
      await onUpdate(form);
    } else {
      await onAdd(form);
    }

    resetForm();
  };

  const startEdit = (p) => {
    setIsAdding(true);
    setIsEditing(true);
    setForm({
      id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      category: p.category,
    });
  };

  return (
    <div
      className={`p-8 ${theme.bg.main} ${theme.text.main}`}
      style={{ fontFamily: FONTS.sans }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Products ({rawProducts.length})
        </h2>
        <button
          onClick={() => {
            setIsAdding(true);
            setIsEditing(false);
          }}
          className={`px-4 py-2 rounded-md text-sm flex items-center gap-2 ${theme.button.primary}`}
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* FORM */}
      {isAdding && (
        <div
          className={`p-6 mb-6 rounded-lg border ${COMMON_STYLES.card(
            isDarkMode
          )}`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className={COMMON_STYLES.input(isDarkMode)}
            />
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className={COMMON_STYLES.input(isDarkMode)}
            />
            <input
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value })
              }
              className={COMMON_STYLES.input(isDarkMode)}
            />
            <input
  list="category-options"
  placeholder="Category"
  value={form.category}
  onChange={(e) =>
    setForm({ ...form, category: e.target.value })
  }
  className={COMMON_STYLES.input(isDarkMode)}
/>

<datalist id="category-options">
  {categories.map((c) => (
    <option key={c} value={c} />
  ))}
</datalist>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={resetForm}
              className={theme.button.secondary}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={theme.button.primary}
            >
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className={`${theme.bg.subtle} text-xs uppercase`}>
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {rawProducts.map((p) => (
              <tr key={p.id}>
                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4 flex items-center gap-2">
                  <Box size={14} />
                  {p.stock}
                </td>
                <td className="p-4">₹{p.price}</td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="p-2"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="p-2 text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}