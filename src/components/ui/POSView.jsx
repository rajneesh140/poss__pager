import React, { useState, useMemo } from "react";
import { Search, Plus, Minus, ShoppingCart, Box } from "lucide-react";
import { getTheme, COMMON_STYLES, FONTS } from "./theme";

export default function POSView({
  menu,
  categories,
  cart,
  selectedCategory,
  setSelectedCategory,
  availableTokens,
  selectedToken,
  onSetToken,
  onAddToCart,
  onRemoveFromCart,
  onCheckout,
  isDarkMode,
  discount,
  setDiscount,
  taxRate,
}) {
  const theme = getTheme(isDarkMode);
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    let list = [];

    if (selectedCategory === "All" || !selectedCategory) {
      Object.values(menu).forEach(arr => (list = list.concat(arr)));
    } else {
      list = menu[selectedCategory] || [];
    }

    if (search) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return list;
  }, [menu, selectedCategory, search]);

  const cartSubtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const taxAmount = Math.max(0, cartSubtotal - discount) * (taxRate / 100);
  const grandTotal = Math.round(
    Math.max(0, cartSubtotal - discount) + taxAmount
  );

  const getCartQty = id => {
    const item = cart.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <div
      className={`flex h-full ${theme.bg.main} ${theme.text.main}`}
      style={{ fontFamily: FONTS.sans }}
    >
      {/* LEFT: PRODUCTS */}
      <div className="flex-1 flex flex-col border-r border-zinc-800">

        {/* SEARCH + CATEGORY */}
        <div className="p-3 space-y-2">

          <input
            className={COMMON_STYLES.input(isDarkMode)}
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="flex gap-2 overflow-x-auto pb-1">
            {["All", ...categories].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs whitespace-nowrap ${
                  selectedCategory === cat
                    ? theme.button.primary
                    : theme.button.secondary
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="flex-1 overflow-auto p-3 grid grid-cols-3 md:grid-cols-6 xl:grid-cols-7 gap-3 content-start">
          {filteredProducts.map(p => {
            const qty = getCartQty(p.id);

            return (
              <div
                key={p.id}
                className={`${COMMON_STYLES.card(isDarkMode)} h-[95px] p-3 flex flex-col justify-between`}
              >

                {/* TOP */}
                <div>
                  <p className="text-[10px] opacity-60">{p.category}</p>

                  <h3 className="text-sm font-semibold leading-tight">
                    {p.name}
                  </h3>

                  <div className="flex items-center gap-1 text-[11px] opacity-70 mt-1">
                    <Box size={12} />
                    {p.stock}
                  </div>
                </div>

                {/* BOTTOM */}
                <div className="flex items-center justify-between">

                  <span className="text-sm font-semibold">
                    ₹{p.price}
                  </span>

                  <div className="flex items-center gap-1">

                    <button
                      onClick={() => onRemoveFromCart(p)}
                      className="p-1 rounded bg-zinc-800 hover:bg-zinc-700"
                    >
                      <Minus size={12} />
                    </button>

                    <span className="text-xs w-4 text-center">
                      {qty}
                    </span>

                    <button
                      disabled={p.stock <= 0}
                      onClick={() => onAddToCart(p)}
                      className="p-1 rounded bg-zinc-800 hover:bg-zinc-700"
                    >
                      <Plus size={12} />
                    </button>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      </div>


      {/* RIGHT: CART */}
      <div className="w-80 flex flex-col border-l border-zinc-800">

        {/* HEADER */}
        <div className="p-3 flex justify-between items-center border-b border-zinc-800">

          <div className="flex items-center gap-2">
            <ShoppingCart size={18} />
            <span className="text-sm font-semibold">
              Cart
            </span>
          </div>

          <select
            value={selectedToken}
            onChange={e => onSetToken(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-sm px-2 py-1 rounded"
          >
            {availableTokens.map(t => (
              <option key={t}>{t}</option>
            ))}
          </select>

        </div>


        {/* CART ITEMS */}
        <div className="flex-1 overflow-auto p-3 space-y-2">

          {cart.length === 0 && (
            <p className="text-xs opacity-60 text-center mt-6">
              Cart is empty
            </p>
          )}

          {cart.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex flex-col">
                <span>{item.name}</span>
                <span className="text-xs opacity-60">
                  ₹{item.price}
                </span>
              </div>

              <div className="flex items-center gap-2">

                <button
                  onClick={() => onRemoveFromCart(item)}
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700"
                >
                  <Minus size={12} />
                </button>

                <span className="w-4 text-center text-xs">
                  {item.quantity}
                </span>

                <button
                  onClick={() => onAddToCart(item)}
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700"
                >
                  <Plus size={12} />
                </button>

              </div>
            </div>
          ))}
        </div>


        {/* TOTALS */}
        <div className="p-3 border-t border-zinc-800 space-y-2 text-sm">

          <div className="flex justify-between opacity-70">
            <span>Subtotal</span>
            <span>₹{cartSubtotal}</span>
          </div>

          <div className="flex justify-between opacity-70">
            <span>GST</span>
            <span>₹{taxAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>₹{grandTotal}</span>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={onCheckout}
            className={`${theme.button.primary} w-full py-2 mt-2`}
          >
            Checkout
          </button>

        </div>
      </div>
    </div>
  );
}