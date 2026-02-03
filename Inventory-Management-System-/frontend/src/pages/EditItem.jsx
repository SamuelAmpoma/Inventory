import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { inventoryAPI } from '../services/api';
import { useToast } from '../components/Toast';
import Header from '../components/Header';

const EditItem = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        quantity: '',
        price: '',
        description: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        fetchItem();
    }, [id]);

    const fetchItem = async () => {
        try {
            const response = await inventoryAPI.getById(id);
            if (response.success) {
                const item = response.data;
                setFormData({
                    name: item.name || '',
                    sku: item.sku || '',
                    category: item.category || '',
                    quantity: item.quantity?.toString() || '',
                    price: item.price?.toString() || '',
                    description: item.description || '',
                });
            }
        } catch (error) {
            toast.error('Failed to fetch item details');
            navigate('/inventory');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
        if (!formData.category.trim()) newErrors.category = 'Category is required';
        if (!formData.quantity || formData.quantity < 0) newErrors.quantity = 'Valid quantity is required';
        if (!formData.price || formData.price < 0) newErrors.price = 'Valid price is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setSubmitting(true);

        try {
            const response = await inventoryAPI.update(id, {
                ...formData,
                quantity: parseInt(formData.quantity, 10),
                price: parseFloat(formData.price),
            });

            if (response.success) {
                toast.success('Item updated successfully!');
                navigate('/inventory');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update item');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="main">
                    <div className="container">
                        <div className="card">
                            <div className="empty-state">
                                <div className="loader-spinner"></div>
                                <p>Loading item...</p>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="main">
                <div className="container">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">Edit Item</h1>
                            <p className="page-subtitle">Update inventory item details</p>
                        </div>
                        <Link to="/inventory" className="btn btn-secondary">
                            ← Back to Inventory
                        </Link>
                    </div>

                    <div className="card" style={{ maxWidth: '600px' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="name">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-input"
                                    placeholder="Enter product name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                {errors.name && <span className="form-error">{errors.name}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="sku">
                                    SKU (Stock Keeping Unit) *
                                </label>
                                <input
                                    type="text"
                                    id="sku"
                                    name="sku"
                                    className="form-input"
                                    placeholder="e.g., PRD-001"
                                    value={formData.sku}
                                    onChange={handleChange}
                                />
                                {errors.sku && <span className="form-error">{errors.sku}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="category">
                                    Category *
                                </label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    className="form-input"
                                    placeholder="e.g., Electronics, Clothing, Food"
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                                {errors.category && <span className="form-error">{errors.category}</span>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="quantity">
                                        Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        className="form-input"
                                        placeholder="0"
                                        min="0"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                    />
                                    {errors.quantity && <span className="form-error">{errors.quantity}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="price">
                                        Price ($) *
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        className="form-input"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                    {errors.price && <span className="form-error">{errors.price}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="description">
                                    Description (Optional)
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className="form-textarea"
                                    placeholder="Enter product description..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Updating...' : 'Update Item'}
                                </button>
                                <Link to="/inventory" className="btn btn-secondary">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default EditItem;
