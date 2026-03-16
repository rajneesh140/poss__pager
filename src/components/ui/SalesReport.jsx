import React, { useMemo } from 'react';
import { Calendar, Download, TrendingUp, Banknote, Smartphone, Wallet } from 'lucide-react';
import { getTheme, COMMON_STYLES, FONTS } from './theme';

export default function SalesReport({
  history = [],
  reportDate,
  setReportDate,
  isDarkMode
}) {
  const theme = getTheme(isDarkMode);

  // ---------------- FILTER (BACKEND IS SOURCE OF TRUTH) ----------------
  const filteredOrders = useMemo(() => {
    return history
      .filter(o => {
        const d = new Date(o.created_at);
        return (
          !isNaN(d.getTime()) &&
          d.toLocaleDateString('en-CA') === reportDate
        );
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [history, reportDate]);

  

  // ---------------- HOURLY GRAPH ----------------
  const chartData = useMemo(() => {
    const hours = Array(24).fill(0);
    history.forEach(o => {
      const h = new Date(o.created_at).getHours();
      hours[h] += Number(o.total_amount || 0);
    });
    return hours;
  }, [history]);

  const maxSales = Math.max(...chartData, 100);

  // ---------------- CSV EXPORT (EXACT UI DATA) ----------------
  const exportData = () => {
    if (filteredOrders.length === 0) {
      alert("No data");
      return;
    }

    const headers = ["ID", "Time", "Method", "Total"];
    const rows = filteredOrders.map(o =>
      [
        o.id,
        new Date(o.created_at).toLocaleTimeString(),
        o.payment_method.toUpperCase(),
        o.total
      ].join(",")
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Sales_${reportDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="flex flex-col h-full antialiased"
      style={{ fontFamily: FONTS.sans }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-2xl font-semibold ${theme.text.main}`}>
            Dashboard
          </h1>
          <p className={`text-sm ${theme.text.secondary}`}>
            Overview for {reportDate}
          </p>
        </div>

        <div className="flex gap-3">
          <div
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg border ${COMMON_STYLES.card(isDarkMode)}`}
          >
            <Calendar size={18} className={theme.text.secondary} />
            <span className={`text-sm ${theme.text.main}`}>
              {reportDate}
            </span>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <button
            onClick={exportData}
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${theme.button.secondary}`}
          >
            <Download size={18} />
            <span className="text-sm">Export CSV</span>
          </button>
        </div>
      </div>

      

      {/* HOURLY GRAPH */}
      <div className={`mb-6 rounded-xl border p-6 ${COMMON_STYLES.card(isDarkMode)}`}>
        <h2 className={`font-semibold mb-4 ${theme.text.main}`}>
          Hourly Activity
        </h2>
        <div className="h-40 flex gap-2 items-end">
          {chartData.map((val, h) => (
            <div key={h} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-black dark:bg-white rounded-t"
                style={{ height: `${(val / maxSales) * 100}%` }}
              />
              <span className={`text-[10px] mt-1 ${theme.text.secondary}`}>
                {h}:00
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* HISTORY TABLE */}
      
    </div>
  );
}