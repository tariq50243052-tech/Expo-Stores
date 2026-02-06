import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { Plus, Trash2, FileText, Upload, Filter, Download } from 'lucide-react';

const Permits = () => {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');
  
  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('storage');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const permitTypes = [
    { id: 'storage', label: 'Permit to Storage' },
    { id: 'work', label: 'Permit to Work (PTW)' },
    { id: 'movement', label: 'Asset Movement Permit' }
  ];

  useEffect(() => {
    fetchPermits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  const fetchPermits = async () => {
    try {
      const params = filterType !== 'all' ? { type: filterType } : {};
      const res = await api.get('/permits', { params });
      setPermits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      alert('Title and File are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('description', description);
    formData.append('file', file);

    try {
      setLoading(true);
      await api.post('/permits', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Reset form
      setTitle('');
      setType('storage');
      setDescription('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      fetchPermits();
    } catch (err) {
      alert(err.response?.data?.message || 'Error uploading permit');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this permit?')) return;
    try {
      await api.delete(`/permits/${id}`);
      fetchPermits();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting permit');
    }
  };

  const getTypeLabel = (typeId) => {
    return permitTypes.find(t => t.id === typeId)?.label || typeId;
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="text-amber-600" size={32} />
        <h1 className="text-2xl font-bold">Permits Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload size={20} />
              Upload New Permit
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permit Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {permitTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sustainability Basement Storage"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF/JPG)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Uploading...' : (
                  <>
                    <Plus size={20} />
                    Add Permit
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Permits List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-lg font-semibold text-gray-700">Stored Permits</h2>
              
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="all">All Types</option>
                  {permitTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permit Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {permits.map((permit) => (
                    <tr key={permit._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{permit.title}</div>
                        {permit.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">{permit.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${permit.type === 'storage' ? 'bg-blue-100 text-blue-800' : 
                            permit.type === 'work' ? 'bg-red-100 text-red-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {getTypeLabel(permit.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(permit.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3">
                          <a 
                            href={`${api.defaults.baseURL.replace('/api', '')}${permit.filePath}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                            title="View/Download"
                          >
                            <Download size={18} />
                          </a>
                          <button
                            onClick={() => handleDelete(permit._id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {permits.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FileText size={48} className="text-gray-300" />
                          <p>No permits found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permits;
