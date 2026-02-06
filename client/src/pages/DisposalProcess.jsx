import { useState, useEffect } from 'react';
import api from '../api/axios';

const DisposalProcess = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('faulty'); // 'faulty' or 'disposed'

  useEffect(() => {
    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      // Fetch based on tab to keep list clean, or fetch all and filter client side?
      // Let's fetch based on tab to avoid confusion
      const status = activeTab === 'faulty' ? 'Faulty' : 'Disposed';
      const res = await api.get('/assets', {
        params: {
          status: status,
          limit: 100 // Reasonable limit
        }
      });
      setAssets(res.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDispose = async (assetId) => {
    if (!window.confirm('Are you sure you want to mark this asset as Disposed? This action cannot be easily undone.')) return;
    
    try {
      await api.put(`/assets/${assetId}`, { status: 'Disposed', condition: 'Disposed' });
      fetchAssets(); // Refresh list
    } catch (err) {
      console.error(err);
      alert('Failed to dispose asset');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Disposal Process</h1>

      <div className="flex gap-4 mb-6 border-b">
        <button
          className={`pb-2 px-4 font-medium ${activeTab === 'faulty' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('faulty')}
        >
          Faulty (Pending Disposal)
        </button>
        <button
          className={`pb-2 px-4 font-medium ${activeTab === 'disposed' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('disposed')}
        >
          Disposed History
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <p>Loading...</p>
        ) : assets.length === 0 ? (
          <p className="text-sm text-gray-500">No assets found in this category.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unique ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assets.map(a => (
                  <tr key={a._id}>
                    <td className="px-6 py-4">{a.name}</td>
                    <td className="px-6 py-4">{a.serial_number}</td>
                    <td className="px-6 py-4">{a.uniqueId || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${a.status === 'Faulty' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {activeTab === 'faulty' && (
                        <button
                          onClick={() => handleDispose(a._id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Mark as Disposed
                        </button>
                      )}
                      {activeTab === 'disposed' && (
                        <span className="text-gray-400">Archived</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisposalProcess;
