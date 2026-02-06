import { useState, useEffect } from 'react';
import { Search, Package, Edit2, Trash2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import PropTypes from 'prop-types';

const Products = ({ readOnly = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await api.get('/asset-categories/stats');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setProductName('');
    setProductImage(null);
    setEditingProduct(null);
    setDeletingProduct(null);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductImage(null); // Reset image input
    setShowEditModal(true);
  };

  const handleDeleteClick = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      await api.delete(`/asset-categories/products/${deletingProduct._id}`);
      setShowDeleteModal(false);
      setDeletingProduct(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', productName);
      if (productImage) {
        formData.append('image', productImage);
      }

      if (editingProduct) {
        await api.put(`/asset-categories/products/${editingProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setShowEditModal(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || `Failed to update product`);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0]);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.typeName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ProductModal = ({ title, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. Acc-G2"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended: Square image (1:1 aspect ratio)</p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100">
        <h2 className="text-xl font-bold mb-2 text-red-600">Delete Product?</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{deletingProduct?.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {readOnly ? 'Products View' : 'Products Management'}
          </h1>
          <p className="text-sm text-gray-500">
            {readOnly 
              ? 'View all product categories and inventory statistics' 
              : 'Manage product images and view inventory statistics'}
          </p>
        </div>
        {!readOnly && (
          <Link
            to="/setup/asset-categories"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Settings size={20} />
            <span>Manage Hierarchy</span>
          </Link>
        )}
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
          No products found. Add them in Setup &gt; Asset Categories.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link 
              to={`/products/${encodeURIComponent(product.name)}`}
              key={product._id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col block"
            >
              <div className="p-4 flex items-start gap-4 border-b border-gray-50">
                <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                        e.target.parentElement.innerHTML = '<div class="text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>';
                      }}
                    />
                  ) : (
                    <div className="text-gray-400">
                      <Package size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 mb-1 truncate" title={`${product.categoryName} > ${product.typeName}`}>
                    {product.categoryName} &gt; {product.typeName}
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight" title={product.name}>
                      {product.name}
                    </h3>
                    {!readOnly && (
                      <div className="flex gap-1 flex-shrink-0">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditClick(product);
                          }}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                          title="Edit Product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteClick(product);
                          }}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-px bg-gray-100 text-sm flex-1">
                <div className="bg-white p-2 text-center flex flex-col justify-center">
                  <div className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Total</div>
                  <div className="font-bold text-gray-900 text-lg">{product.total}</div>
                </div>
                <div className="bg-white p-2 text-center flex flex-col justify-center">
                  <div className="text-blue-600 text-[10px] uppercase font-bold tracking-wider mb-1">In Use</div>
                  <div className="font-bold text-blue-700 text-lg">{product.inUse}</div>
                </div>
                <div className="bg-white p-2 text-center flex flex-col justify-center">
                  <div className="text-green-600 text-[10px] uppercase font-bold tracking-wider mb-1">In Store</div>
                  <div className="font-bold text-green-700 text-lg">{product.inStore}</div>
                </div>
                <div className="bg-white p-2 text-center flex flex-col justify-center">
                  <div className="text-red-600 text-[10px] uppercase font-bold tracking-wider mb-1">Faulty</div>
                  <div className="font-bold text-red-700 text-lg">{product.faulty}</div>
                </div>
                <div className="bg-white p-2 text-center flex flex-col justify-center">
                  <div className="text-orange-600 text-[10px] uppercase font-bold tracking-wider mb-1">Repair</div>
                  <div className="font-bold text-orange-700 text-lg">{product.underRepair}</div>
                </div>
                <div className="bg-white p-2 text-center flex flex-col justify-center">
                  <div className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Disposed</div>
                  <div className="font-bold text-gray-600 text-lg">{product.disposed}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showEditModal && (
        <ProductModal 
          title="Edit Product" 
          onClose={() => setShowEditModal(false)} 
        />
      )}

      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

Products.propTypes = {
  readOnly: PropTypes.bool
};

export default Products;
