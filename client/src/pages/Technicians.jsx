import { useState, useEffect } from 'react';
import api from '../api/axios';

const Technicians = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', username: '', password: '', phone: '', email: '', assignedStore: '' });
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', username: '', email: '', phone: '', password: '', assignedStore: '' });

  useEffect(() => {
    fetchUsers();
    fetchStores();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await api.get('/stores');
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };
      if (formData.assignedStore) {
        payload.assignedStore = formData.assignedStore;
      }
      await api.post('/users', payload);
      setFormData({ name: '', email: '', password: '', assignedStore: '' });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding technician');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch {
      alert('Error deleting user');
    }
  };
  
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      assignedStore: user.assignedStore?._id || ''
    });
  };
  
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  
  const handleEditSave = async () => {
    try {
      await api.put(`/users/${editingUser._id}`, editForm);
      setEditingUser(null);
      fetchUsers();
      alert('Technician updated');
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating technician');
    }
  };
  
  const handleEditCancel = () => setEditingUser(null);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Technicians</h1>
      
      <div className="bg-white p-4 rounded shadow mb-6">
        <input
          type="text"
          placeholder="Search name, username, email, phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-lg font-bold mb-4">Add New Technician</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" placeholder="Name" className="border p-2 rounded"
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required 
          />
          <input 
            type="text" placeholder="Username" className="border p-2 rounded"
            value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required 
          />
          <input 
            type="email" placeholder="Email" className="border p-2 rounded"
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required 
          />
          <input 
            type="password" placeholder="Password" className="border p-2 rounded"
            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required 
          />
          <input 
            type="tel" placeholder="Phone Number" className="border p-2 rounded"
            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
          />
          <select 
            className="border p-2 rounded"
            value={formData.assignedStore} onChange={e => setFormData({...formData, assignedStore: e.target.value})}
          >
            <option value="">Select Store (Optional)</option>
            {stores.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-black px-4 py-2 rounded md:col-span-2">Create Account</button>
        </form>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Store</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.filter(u => {
              if (!searchTerm.trim()) return true;
              const q = searchTerm.toLowerCase();
              return (u.name || '').toLowerCase().includes(q)
                || (u.username || '').toLowerCase().includes(q)
                || (u.email || '').toLowerCase().includes(q)
                || (u.phone || '').toLowerCase().includes(q)
                || (u.assignedStore?.name || '').toLowerCase().includes(q);
            }).map(user => (
              <tr key={user._id}>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.username || '-'}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone || '-'}</td>
                <td className="px-6 py-4">{user.assignedStore?.name || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button onClick={() => handleEditClick(user)} className="text-amber-600">Edit</button>
                    <button onClick={() => handleDelete(user._id)} className="text-red-500">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Technician</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={editForm.username}
                  onChange={handleEditChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password (optional)</label>
                <input
                  type="password"
                  name="password"
                  value={editForm.password}
                  onChange={handleEditChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Leave blank to keep current"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Store</label>
                <select
                  name="assignedStore"
                  value={editForm.assignedStore}
                  onChange={handleEditChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Select Store (Optional)</option>
                  {stores.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleEditCancel}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="bg-amber-600 hover:bg-amber-700 text-black px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Technicians;
