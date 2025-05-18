import React from "react";

export default function DashboardLatestTrans({ transactions }) {
  return (
    <div>
      <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {transactions?.length > 0 ? (
            transactions.slice(0, 5).map((transaction, index) => (
              <div
                key={transaction.id || `transaction-${index}`} // Ensure unique key
                className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium">
                    {transaction.type === "income"
                      ? transaction.source
                      : transaction.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div
                  className={`font-medium ${
                    transaction.type === "income"
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}₹
                  {transaction.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="px-6 py-4 text-center text-sm text-gray-500">
              No transactions found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

