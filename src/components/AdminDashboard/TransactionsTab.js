import React from 'react';

const TransactionsTab = ({ transactions }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">User</th>
            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((transaction) => (
            <tr key={transaction.id}>
              <td className="py-2 px-4 border-b">{transaction.id}</td>
              <td className="py-2 px-4 border-b">{transaction.user}</td>
              <td className="py-2 px-4 border-b">${transaction.amount}</td>
              <td className="py-2 px-4 border-b">{new Date(transaction.date).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">{transaction.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTab;
