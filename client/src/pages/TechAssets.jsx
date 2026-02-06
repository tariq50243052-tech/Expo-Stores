import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const TechAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [returnModal, setReturnModal] = useState({ open: false, asset: null, condition: 'New', ticketNumber: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/assets/my');
        setAssets(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const classify = (a) => {
    const lastByMe = [...(a.history || [])].reverse().find(h => h.user === user?.name);
    const lastCollected = [...(a.history || [])].reverse().find(h => /^Collected\//.test(h.action) && h.user === user?.name);
    if (a.assigned_to && user && a.assigned_to._id === user._id) {
      if (lastCollected) {
        const sub = lastCollected.action.split('/')[1];
        return sub === 'New' ? 'Received/New' : 'Received/Used';
      }
      return 'Received/Used';
    }
    if (lastByMe && /^Returned\/(New|Used|Faulty)$/i.test(lastByMe.action)) {
      const cond = lastByMe.action.split('/')[1];
      if (cond === 'New') return 'Returned/New';
      if (cond === 'Used') return 'Returned/Used';
      return 'Returned/Faulty';
    }
    if (lastByMe && lastByMe.action === 'Reported Faulty') return 'Returned/Faulty';
    return 'Other';
  };

  const groups = {
    'Received/New': assets
      .filter(a => classify(a) === 'Received/New')
      .filter(a => {
        const q = query.toLowerCase();
        return !q || 
          (a.name || '').toLowerCase().includes(q) ||
          (a.model_number || '').toLowerCase().includes(q) ||
          (a.serial_number || '').toLowerCase().includes(q) ||
          (a.mac_address || '').toLowerCase().includes(q) ||
          (a.store?.name || '').toLowerCase().includes(q);
      }),
    'Received/Used': assets
      .filter(a => classify(a) === 'Received/Used')
      .filter(a => {
        const q = query.toLowerCase();
        return !q || 
          (a.name || '').toLowerCase().includes(q) ||
          (a.model_number || '').toLowerCase().includes(q) ||
          (a.serial_number || '').toLowerCase().includes(q) ||
          (a.mac_address || '').toLowerCase().includes(q) ||
          (a.store?.name || '').toLowerCase().includes(q);
      }),
    'Returned/New': assets
      .filter(a => classify(a) === 'Returned/New')
      .filter(a => {
        const q = query.toLowerCase();
        return !q || 
          (a.name || '').toLowerCase().includes(q) ||
          (a.model_number || '').toLowerCase().includes(q) ||
          (a.serial_number || '').toLowerCase().includes(q) ||
          (a.mac_address || '').toLowerCase().includes(q) ||
          (a.store?.name || '').toLowerCase().includes(q);
      }),
    'Returned/Used': assets
      .filter(a => classify(a) === 'Returned/Used')
      .filter(a => {
        const q = query.toLowerCase();
        return !q || 
          (a.name || '').toLowerCase().includes(q) ||
          (a.model_number || '').toLowerCase().includes(q) ||
          (a.serial_number || '').toLowerCase().includes(q) ||
          (a.mac_address || '').toLowerCase().includes(q) ||
          (a.store?.name || '').toLowerCase().includes(q);
      }),
    'Returned/Faulty': assets
      .filter(a => classify(a) === 'Returned/Faulty')
      .filter(a => {
        const q = query.toLowerCase();
        return !q || 
          (a.name || '').toLowerCase().includes(q) ||
          (a.model_number || '').toLowerCase().includes(q) ||
          (a.serial_number || '').toLowerCase().includes(q) ||
          (a.mac_address || '').toLowerCase().includes(q) ||
          (a.store?.name || '').toLowerCase().includes(q);
      }),
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Assets</h1>
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, model, serial, MAC or store"
          className="w-full max-w-md border p-2 rounded"
        />
      </div>
      {Object.entries(groups).map(([title, list]) => (
        <div key={title} className="mb-6">
          <h2 className="text-lg font-semibold mb-3">{title}</h2>
          {list.length === 0 ? (
            <p className="text-sm text-gray-500">No items</p>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded shadow overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Serial</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Store</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
                      {(title === 'Received/New' || title === 'Received/Used') && <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {list.map(a => (
                      <tr key={a._id}>
                        <td className="px-4 py-2">{a.name}</td>
                        <td className="px-4 py-2">{a.model_number}</td>
                        <td className="px-4 py-2">{a.serial_number}</td>
                        <td className="px-4 py-2">{a.ticket_number || '-'}</td>
                        <td className="px-4 py-2">{a.store?.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{new Date(a.updatedAt).toLocaleString()}</td>
                        {(title === 'Received/New' || title === 'Received/Used') && (
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setReturnModal({ open: true, asset: a, condition: 'New', ticketNumber: '' })}
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                              >
                                Return/New
                              </button>
                              <button
                                onClick={() => setReturnModal({ open: true, asset: a, condition: 'Used', ticketNumber: '' })}
                                className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                              >
                                Return/Used
                              </button>
                              <button
                                onClick={() => setReturnModal({ open: true, asset: a, condition: 'Faulty', ticketNumber: '' })}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Return/Faulty
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {list.map(a => (
                  <div key={a._id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{a.name}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{a.store?.name}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="block text-xs text-gray-400 uppercase">Model</span>
                        {a.model_number}
                      </div>
                      <div>
                        <span className="block text-xs text-gray-400 uppercase">Serial</span>
                        <span className="font-mono text-xs">{a.serial_number}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-400 uppercase">Ticket</span>
                        {a.ticket_number || '-'}
                      </div>
                      <div>
                        <span className="block text-xs text-gray-400 uppercase">Updated</span>
                        {new Date(a.updatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {(title === 'Received/New' || title === 'Received/Used') && (
                      <div className="border-t pt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => setReturnModal({ open: true, asset: a, condition: 'New', ticketNumber: '' })}
                          className="flex-1 bg-green-50 text-green-700 border border-green-200 py-2 rounded text-xs font-semibold text-center"
                        >
                          Return New
                        </button>
                        <button
                          onClick={() => setReturnModal({ open: true, asset: a, condition: 'Used', ticketNumber: '' })}
                          className="flex-1 bg-amber-50 text-amber-700 border border-amber-200 py-2 rounded text-xs font-semibold text-center"
                        >
                          Return Used
                        </button>
                        <button
                          onClick={() => setReturnModal({ open: true, asset: a, condition: 'Faulty', ticketNumber: '' })}
                          className="flex-1 bg-red-50 text-red-700 border border-red-200 py-2 rounded text-xs font-semibold text-center"
                        >
                          Return Faulty
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
      
      {returnModal.open && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Return Asset</h2>
            <p className="text-sm text-gray-600 mb-2">
              Asset: <span className="font-semibold">{returnModal.asset?.name}</span> ({returnModal.asset?.serial_number})
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Condition</label>
                <select
                  value={returnModal.condition}
                  onChange={(e) => setReturnModal(prev => ({ ...prev, condition: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Faulty">Faulty</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ticket Number</label>
                <input
                  type="text"
                  value={returnModal.ticketNumber}
                  onChange={(e) => setReturnModal(prev => ({ ...prev, ticketNumber: e.target.value }))}
                  placeholder="Enter Ticket #"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setReturnModal({ open: false, asset: null, condition: 'New', ticketNumber: '' })}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!returnModal.ticketNumber.trim()) {
                    alert('Please enter a Ticket Number');
                    return;
                  }
                  try {
                        await api.post('/assets/return', {
                      assetId: returnModal.asset._id,
                      condition: returnModal.condition,
                      ticketNumber: returnModal.ticketNumber.trim()
                    });
                        alert('Asset returned');
                    setReturnModal({ open: false, asset: null, condition: 'New', ticketNumber: '' });
                    const res = await api.get('/assets/my');
                    setAssets(res.data);
                  } catch (err) {
                    alert(err.response?.data?.message || 'Failed to submit return request');
                  }
                }}
                className="bg-amber-600 hover:bg-amber-700 text-black px-4 py-2 rounded"
              >
                    Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechAssets;
