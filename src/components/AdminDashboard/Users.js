import React, { useState, useEffect } from 'react';
import { getAllUsers, getUserById, updateUserById, deleteUser, updateUserBalance, promoteUserToAdmin, updateUserPassword, createUser } from '../../api/admin';
import { Eye, Edit, Trash2, DollarSign, UserPlus, Key, Plus, Search } from 'react-feather';
import Modal from '../common/Modal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      fetchUsers();
      return;
    }
    try {
      const response = await getUserById(searchTerm);
      setUsers(response.data ? [response.data] : []);
    } catch (error) {
      console.error('Error searching user:', error);
      setUsers([]);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalContent('create');
    setIsModalOpen(true);
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await getUserById(userId);
      setSelectedUser(response.data);
      setModalContent('view');
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalContent('edit');
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleUpdateBalance = (user) => {
    setSelectedUser(user);
    setModalContent('balance');
    setIsModalOpen(true);
  };

  const handlePromoteUser = async (userId) => {
    if (window.confirm('Are you sure you want to promote this user to admin?')) {
      try {
        await promoteUserToAdmin(userId);
        fetchUsers();
      } catch (error) {
        console.error('Error promoting user:', error);
      }
    }
  };

  const handleUpdatePassword = (user) => {
    setSelectedUser(user);
    setModalContent('password');
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setModalContent(null);
  };

  const handleModalSubmit = async (data) => {
    try {
      switch (modalContent) {
        case 'create':
          await createUser(data);
          break;
        case 'edit':
          await updateUserById(selectedUser._id, data);
          break;
        case 'balance':
          await updateUserBalance(selectedUser._id, { amount: parseFloat(data.amount) });
          break;
        case 'password':
          await updateUserPassword(selectedUser._id, { newPassword: data.newPassword });
          break;
        default:
          break;
      }
      fetchUsers();
      handleModalClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Users</h2>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative flex w-full sm:w-64">
            <input
              type="text"
              className="w-full pl-8 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600"
              placeholder="Search by ID or username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Search
          </button>
          <button
            onClick={handleCreateUser}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
          >
            <Plus size={16} className="mr-2" />
            Create User
          </button>
        </div>
      </div>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Username', 'Email', 'Subscription', 'End Date', 'Balance', 'Actions'].map((header) => (
                  <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user._id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {user.subscriptionPlan}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${user.balance.toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-1">
                      {[
                        { icon: Eye, color: 'blue', action: () => handleViewUser(user._id), title: 'View' },
                        { icon: Edit, color: 'yellow', action: () => handleEditUser(user), title: 'Edit' },
                        { icon: Trash2, color: 'red', action: () => handleDeleteUser(user._id), title: 'Delete' },
                        { icon: DollarSign, color: 'green', action: () => handleUpdateBalance(user), title: 'Update Balance' },
                        { icon: UserPlus, color: 'purple', action: () => handlePromoteUser(user._id), title: 'Promote to Admin' },
                        { icon: Key, color: 'gray', action: () => handleUpdatePassword(user), title: 'Update Password' },
                      ].map(({ icon: Icon, color, action, title }) => (
                        <button
                          key={title}
                          onClick={action}
                          className={`text-${color}-600 hover:text-${color}-900 p-1 rounded-full hover:bg-${color}-100 transition duration-150 ease-in-out`}
                          title={title}
                        >
                          <Icon size={16} />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          content={modalContent}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default Users;
