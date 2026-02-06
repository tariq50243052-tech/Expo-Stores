import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, FileText, Box, CheckSquare, RefreshCw, Trash2, Database, AlertTriangle } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Setup = () => {
  const { user } = useAuth();
  const [storage, setStorage] = useState(null);
  const [resetPassword, setResetPassword] = useState('');
  const isMainAdmin = user?.role === 'Super Admin';

  useEffect(() => {
    if (isMainAdmin) {
      const fetchStorage = async () => {
        try {
          const res = await api.get('/system/storage');
          setStorage(res.data);
        } catch (e) {
          console.error(e);
        }
      };
      fetchStorage();
    }
  }, [isMainAdmin]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">System Setup & Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Approval Process Section */}
        <div className="col-span-full mb-4">
           <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Approval Process</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Link to="/admin-requests" className="block group">
               <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 h-full">
                 <div className="flex items-center justify-between mb-4">
                   <div className="bg-blue-100 p-3 rounded-full">
                     <CheckSquare className="text-blue-600" size={32} />
                   </div>
                 </div>
                 <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600">Issuance</h2>
                 <p className="text-gray-600">Manage asset issuance requests.</p>
               </div>
             </Link>

             <Link to="/receive-process" className="block group">
               <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 h-full">
                 <div className="flex items-center justify-between mb-4">
                   <div className="bg-indigo-100 p-3 rounded-full">
                     <RefreshCw className="text-indigo-600" size={32} />
                   </div>
                 </div>
                 <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-indigo-600">Receive</h2>
                 <p className="text-gray-600">Process incoming returns and new stocks.</p>
               </div>
             </Link>

             <Link to="/disposal-process" className="block group">
               <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 h-full">
                 <div className="flex items-center justify-between mb-4">
                   <div className="bg-red-100 p-3 rounded-full">
                     <Trash2 className="text-red-600" size={32} />
                   </div>
                 </div>
                 <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-red-600">Disposal</h2>
                 <p className="text-gray-600">Manage asset disposal and write-offs.</p>
               </div>
             </Link>
           </div>
        </div>

        <h2 className="col-span-full text-xl font-semibold text-gray-700 mt-6 mb-4 border-b pb-2">General Setup</h2>

        <Link to="/vendors" className="block group">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Truck className="text-blue-600" size={32} />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600">Vendor Management</h2>
            <p className="text-gray-600">
              Add, edit, and manage vendors. Track contact details, tax IDs, and payment terms.
            </p>
          </div>
        </Link>

        <Link to="/purchase-orders" className="block group">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FileText className="text-green-600" size={32} />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-green-600">Purchase Orders</h2>
            <p className="text-gray-600">
              Create and manage purchase orders. Track order status, deliveries, and costs.
            </p>
          </div>
        </Link>

        <Link to="/setup/products" className="block group">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Box className="text-amber-600" size={32} />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-amber-600">Products</h2>
            <p className="text-gray-600">
              Manage product categories, view stats, and handle product images. Add or remove products like Cameras, Readers, etc.
            </p>
          </div>
        </Link>

        <Link to="/setup/asset-categories" className="block group">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-teal-100 p-3 rounded-full">
                <Box className="text-teal-600" size={32} />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-teal-600">Asset Categories</h2>
            <p className="text-gray-600">
              Customize asset categories for the sidebar. Add or remove categories like Networking, Tools, etc.
            </p>
          </div>
        </Link>

        <Link to="/permits" className="block group">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <FileText className="text-purple-600" size={32} />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-purple-600">Permits & Records</h2>
            <p className="text-gray-600">
              Manage permits (Storage, PTW, Asset Movement). Upload and view permit files.
            </p>
          </div>
        </Link>
      </div>

      {/* Database Management Section (Admin Only) */}
      {isMainAdmin && storage && (
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Database className="w-6 h-6 text-gray-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Database Management</h2>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Storage Usage</h3>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Used: {(storage.usedBytes / (1024 * 1024)).toFixed(1)} MB</span>
              <span>Limit: {(storage.limitBytes / (1024 * 1024)).toFixed(0)} MB</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  storage.percentUsed < 70 ? 'bg-green-500' : 
                  storage.percentUsed < 90 ? 'bg-amber-500' : 'bg-red-600'
                }`}
                style={{ width: `${Math.min(storage.percentUsed, 100)}%` }}
              />
            </div>
            <p className="text-right text-xs text-gray-400 mt-1">{storage.percentUsed}% Used</p>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center mb-4 text-red-600">
               <AlertTriangle className="w-5 h-5 mr-2" />
               <h3 className="text-lg font-bold">Danger Zone</h3>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <p className="text-red-700 mb-4 text-sm">
                Actions here are irreversible. Please proceed with caution.
              </p>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  placeholder="Enter Super Admin password"
                  className="flex-1 border border-red-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <button
                  onClick={async () => {
                    if (!resetPassword) return;
                    const ok = window.confirm('WARNING: This will erase all stores, assets, requests, and logs. Users, Products and Categories will remain. This action cannot be undone. Continue?');
                    if (!ok) return;
                    try {
                      await api.post('/system/reset', { password: resetPassword });
                      setResetPassword('');
                      alert('Database reset completed. Users, Products and Categories preserved.');
                      window.location.reload();
                    } catch (err) {
                      console.error('Reset error details:', err);
                      const msg = err.response?.data?.message || err.message || 'Unknown error';
                      alert(`Reset failed: ${msg}`);
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-medium shadow-sm whitespace-nowrap"
                >
                  Reset Database
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setup;
