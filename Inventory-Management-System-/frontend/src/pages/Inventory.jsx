import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryAPI } from '../services/api';
import { useToast } from '../components/Toast';
import Header from '../components/Header';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ show: false, item: null });
    const toast = useToast();

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        // Filter items based on search term
        if (searchTerm) {
            const filtered = items.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredItems(filtered);
        } else {
            setFilteredItems(items);
        }
    }, [searchTerm, items]);

    const fetchItems = async () => {
        try {
            const response = await inventoryAPI.getAll();
            if (response.success) {
                setItems(response.data);
                setFilteredItems(response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch inventory items');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.item) return;

        try {
            const response = await inventoryAPI.delete(deleteModal.item._id || deleteModal.item.id);
            if (response.success) {
                toast.success('Item deleted successfully');
                setItems((prev) => prev.filter((item) => (item._id || item.id) !== (deleteModal.item._id || deleteModal.item.id)));
            }
        } catch (error) {
            toast.error('Failed to delete item');
        } finally {
            setDeleteModal({ show: false, item: null });
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getStockBadge = (quantity) => {
        if (quantity < 10) return 'badge-danger';
        if (quantity < 25) return 'badge-warning';
        return 'badge-success';
    };

    return (
        <>
            <Header />
            <main className="main">
                <div className="container">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">Inventory</h1>
                            <p className="page-subtitle">Manage your products and stock levels</p>
                        </div>
                        <Link to="/add-item" className="btn btn-primary">
                            + Add New Item
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="search-bar" style={{ marginBottom: '24px' }}>
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="form-input search-input"
                            placeholder="Search by name, SKU, or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Items Table */}
                    {loading ? (
                        <div className="card">
                            <div className="empty-state">
                                <div className="loader-spinner"></div>
                                <p>Loading inventory...</p>
                            </div>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="card">
                            <div className="empty-state">
                                <div className="empty-state-icon">📦</div>
                                <h3 className="empty-state-title">
                                    {searchTerm ? 'No items found' : 'No inventory items'}
                                </h3>
                                <p>
                                    {searchTerm
                                        ? 'Try a different search term'
                                        : 'Start by adding your first inventory item'}
                                </p>
                                {!searchTerm && (
                                    <Link to="/add-item" className="btn btn-primary" style={{ marginTop: '16px' }}>
                                        Add First Item
                                    </Link>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>SKU</th>
                                        <th>Category</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Value</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.map((item) => (
                                        <tr key={item._id || item.id}>
                                            <td>
                                                <strong>{item.name}</strong>
                                                {item.description && (
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                                                        {item.description.length > 50
                                                            ? item.description.substring(0, 50) + '...'
                                                            : item.description}
                                                    </div>
                                                )}
                                            </td>
                                            <td><code style={{ color: 'var(--color-accent-secondary)' }}>{item.sku}</code></td>
                                            <td>{item.category}</td>
                                            <td>
                                                <span className={`badge ${getStockBadge(item.quantity)}`}>
                                                    {item.quantity}
                                                </span>
                                            </td>
                                            <td>{formatCurrency(item.price)}</td>
                                            <td>{formatCurrency(item.price * item.quantity)}</td>
                                            <td>
                                                <div className="actions">
                                                    <Link
                                                        to={`/edit-item/${item._id || item.id}`}
                                                        className="btn btn-icon"
                                                        title="Edit"
                                                    >
                                                        ✏️
                                                    </Link>
                                                    <button
                                                        className="btn btn-icon"
                                                        onClick={() => setDeleteModal({ show: true, item })}
                                                        title="Delete"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Summary Footer */}
                    {filteredItems.length > 0 && (
                        <div style={{ marginTop: '16px', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                            Showing {filteredItems.length} of {items.length} items
                        </div>
                    )}
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="modal-overlay" onClick={() => setDeleteModal({ show: false, item: null })}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Delete Item</h3>
                        <p className="modal-text">
                            Are you sure you want to delete <strong>{deleteModal.item?.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="modal-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setDeleteModal({ show: false, item: null })}
                            >
                                Cancel
                            </button>
                            <button className="btn btn-danger" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Inventory;
