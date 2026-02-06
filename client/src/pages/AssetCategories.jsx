import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Box, Edit, Check, X, Folder, Tag, ChevronRight, ChevronDown } from 'lucide-react';

const ProductNode = ({ product, onAddChild }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = product.children && product.children.length > 0;

  return (
    <div className="ml-4 border-l border-gray-100 pl-2">
      <div className="flex items-center justify-between group py-1">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button 
            onClick={() => setExpanded(!expanded)}
            className={`p-0.5 rounded hover:bg-gray-100 ${hasChildren ? 'visible' : 'invisible'}`}
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          <Tag size={14} className="text-green-500" />
          <span>{product.name}</span>
        </div>
        <button 
          onClick={() => onAddChild(product._id)}
          className="opacity-0 group-hover:opacity-100 text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded hover:bg-gray-100 flex items-center gap-1 transition-opacity"
        >
          <Plus size={12} /> Add Child
        </button>
      </div>
      
      {expanded && hasChildren && (
        <div className="ml-2">
          {product.children.map((child, idx) => (
            <ProductNode key={child._id || idx} product={child} onAddChild={onAddChild} />
          ))}
        </div>
      )}
    </div>
  );
};

const AssetCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Edit Category
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  // Expand/Collapse State
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedTypes, setExpandedTypes] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/asset-categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCategory = (id) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleType = (catId, typeName) => {
    const key = `${catId}-${typeName}`;
    setExpandedTypes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- Category Actions ---
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      setLoading(true);
      await api.post('/asset-categories', { name: newCategory });
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete category? This will remove all nested types and products.')) return;
    try {
      await api.delete(`/asset-categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting category');
    }
  };

  const handleUpdateCategory = async (id) => {
    if (!editName.trim()) return;
    try {
      await api.put(`/asset-categories/${id}`, { name: editName });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating category');
    }
  };

  // --- Type Actions ---
  const handleAddType = async (catId) => {
    const name = prompt("Enter Product Type Name:");
    if (!name) return;
    
    try {
      await api.post(`/asset-categories/${catId}/types`, { name });
      fetchCategories();
      setExpandedCategories(prev => ({ ...prev, [catId]: true }));
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding type');
    }
  };

  // --- Product Actions ---
  const handleAddProduct = async (catId, typeName) => {
    const name = prompt("Enter Product Model Name:");
    if (!name) return;

    try {
      await api.post(`/asset-categories/${catId}/types/${typeName}/products`, { name });
      fetchCategories();
      const typeKey = `${catId}-${typeName}`;
      setExpandedTypes(prev => ({ ...prev, [typeKey]: true }));
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding product');
    }
  };

  const handleAddChild = async (parentId) => {
    const name = prompt("Enter Child Product Name:");
    if (!name) return;

    try {
      await api.post(`/asset-categories/products/${parentId}/children`, { name });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding child product');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Box className="text-amber-600" size={32} />
        <h1 className="text-2xl font-bold">Asset Categories Hierarchy</h1>
      </div>

      {/* Add New Category */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Top-Level Category Name"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Plus size={20} /> Add Category
          </button>
        </form>
      </div>

      {/* List Categories */}
      <div className="space-y-4">
        {categories.map(cat => (
          <div key={cat._id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            {/* Category Header */}
            <div className="p-4 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <button onClick={() => toggleCategory(cat._id)} className="text-gray-500 hover:text-amber-600">
                  {expandedCategories[cat._id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
                <Box size={20} className="text-amber-600" />
                
                {editingId === cat._id ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border rounded px-2 py-1"
                      autoFocus
                    />
                    <button onClick={() => handleUpdateCategory(cat._id)} className="text-green-600"><Check size={18} /></button>
                    <button onClick={() => setEditingId(null)} className="text-red-600"><X size={18} /></button>
                  </div>
                ) : (
                  <span className="font-semibold text-lg">{cat.name}</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleAddType(cat._id)}
                  className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 flex items-center gap-1"
                >
                  <Plus size={16} /> Add Type
                </button>
                <button onClick={() => { setEditingId(cat._id); setEditName(cat.name); }} className="text-gray-400 hover:text-blue-600 p-1">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDeleteCategory(cat._id)} className="text-gray-400 hover:text-red-600 p-1">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Types List (Level 2) */}
            {expandedCategories[cat._id] && (
              <div className="p-4 pt-0 bg-white">
                {cat.types && cat.types.length > 0 ? (
                  <div className="ml-8 mt-2 space-y-3 border-l-2 border-gray-100 pl-4">
                    {cat.types.map((type, tIdx) => {
                      const typeKey = `${cat._id}-${type.name}`;
                      return (
                        <div key={tIdx} className="group">
                          <div className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-2">
                              <button onClick={() => toggleType(cat._id, type.name)} className="text-gray-400 hover:text-blue-600">
                                {expandedTypes[typeKey] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                              </button>
                              <Folder size={18} className="text-blue-500" />
                              <span className="font-medium text-gray-700">{type.name}</span>
                            </div>
                            <button 
                              onClick={() => handleAddProduct(cat._id, type.name)}
                              className="opacity-0 group-hover:opacity-100 text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 flex items-center gap-1 transition-opacity"
                            >
                              <Plus size={14} /> Add Product
                            </button>
                          </div>

                          {/* Products List (Level 3+) */}
                          {expandedTypes[typeKey] && (
                            <div className="ml-8 mt-1 space-y-1 border-l-2 border-gray-50 pl-4">
                              {type.products && type.products.length > 0 ? (
                                type.products.map((prod, pIdx) => (
                                  <ProductNode key={prod._id || pIdx} product={prod} onAddChild={handleAddChild} />
                                ))
                              ) : (
                                <div className="text-xs text-gray-400 italic py-1">No products yet</div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="ml-8 mt-2 text-sm text-gray-400 italic">No types added yet.</div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {categories.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No categories found. Add one above to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetCategories;