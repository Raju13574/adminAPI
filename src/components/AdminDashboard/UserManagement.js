import React from 'react';

const UserManagement = ({ users }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Subscription Plan</th>
            <th className="py-2 px-4 border-b">Free Credits</th>
            <th className="py-2 px-4 border-b">Paid Credits</th>
            <th className="py-2 px-4 border-b">Balance</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="py-2 px-4 border-b">{user.username}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.subscriptionPlan}</td>
              <td className="py-2 px-4 border-b">{user.freeCredits}</td>
              <td className="py-2 px-4 border-b">{user.paidCredits}</td>
              <td className="py-2 px-4 border-b">${user.balance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
