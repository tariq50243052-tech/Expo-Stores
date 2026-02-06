import { useState, useEffect } from 'react';
import PurchaseOrders from './PurchaseOrders';
import api from '../api/axios';

const ReceiveProcess = () => {
  const [activeTab, setActiveTab] = useState('vendor'); // 'vendor' or 'technician'
  const [pendingReturns, setPendingReturns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'technician') {
      fetchPendingReturns();
    }
  }, [activeTab]);

  const fetchPendingReturns = async () => {
    setLoading(true);
    try {
      const res = await api.get('/assets/return-pending');
      setPendingReturns(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReturn = async (assetId) => {
    try {
      await api.post('/assets/return-approve', { assetId });
      fetchPendingReturns();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectReturn = async (assetId) => {
    try {
      await api.post('/assets/return-reject', { assetId });
      fetchPendingReturns();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Receive Process</h1>
      
      <div className="flex gap-4 mb-6 border-b">
        <button
          className={`pb-2 px-4 font-medium ${activeTab === 'vendor' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('vendor')}
        >
          Vendor Deliveries (POs)
        </button>
        <button
          className={`pb-2 px-4 font-medium ${activeTab === 'technician' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('technician')}
        >
          Technician Returns
        </button>
      </div>

      {activeTab === 'vendor' ? (
        <PurchaseOrders />
      ) : (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Pending Returns from Technicians</h2>
          {loading ? (
            <p>Loading...</p>
          ) : pendingReturns.length === 0 ? (
            <p className="text-sm text-gray-500">No pending return requests</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingReturns.map(a => (
                    <tr key={a._id}>
                      <td className="px-6 py-4">{a.name}</td>
                      <td className="px-6 py-4">{a.serial_number}</td>
                      <td className="px-6 py-4">{a.return_request?.requested_by_name || '-'}</td>
                      <td className="px-6 py-4">{a.return_request?.condition}</td>
                      <td className="px-6 py-4">{a.return_request?.ticket_number}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApproveReturn(a._id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            Approve (Receive)
                          </button>
                          <button
                            onClick={() => handleRejectReturn(a._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceiveProcess;
