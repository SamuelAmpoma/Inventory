import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { inventoryAPI } from '../services/api';
import Header from '../components/Header';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalItems: 0,
        lowStock: 0,
        totalValue: 0,
        categories: 0,
    });
    const [recentItems, setRecentItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await inventoryAPI.getAll();
            if (response.success) {
                const items = response.data;

                // Calculate stats
                const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const lowStock = items.filter((item) => item.quantity < 10).length;
                const categories = [...new Set(items.map((item) => item.category))].length;

                setStats({
                    totalItems: items.length,
                    lowStock,
                    totalValue,
                    categories,
                });

                // Get recent items (last 5)
                setRecentItems(items.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <>
            <Header />
            <main className="main">
                <div className="container">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">Welcome back, {user?.name}!</h1>
                            <p className="page-subtitle">Here's an overview of your inventory</p>
                        </div>
                        <Link to="/add-item" className="btn btn-primary">
                            + Add New Item
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon primary">📦</div>
                            <div className="stat-value">{stats.totalItems}</div>
                            <div className="stat-label">Total Items</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon warning">⚠️</div>
                            <div className="stat-value">{stats.lowStock}</div>
                            <div className="stat-label">Low Stock Items</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon success">💰</div>
                            <div className="stat-value">{formatCurrency(stats.totalValue)}</div>
                            <div className="stat-label">Total Inventory Value</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon accent">🏷️</div>
                            <div className="stat-value">{stats.categories}</div>
                            <div className="stat-label">Categories</div>
                        </div>
                    </div>

                    {/* Recent Items */}
                    <div className="card">
                        <div className="card-header flex justify-between items-center">
                            <h2 className="card-title">Recent Items</h2>
                            <Link to="/inventory" className="btn btn-secondary">
                                View All
                            </Link>
                        </div>

                        {loading ? (
                            <div className="empty-state">
                                <div className="loader-spinner"></div>
                                <p>Loading...</p>
                            </div>
                        ) : recentItems.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📦</div>
                                <h3 className="empty-state-title">No items yet</h3>
                                <p>Start by adding your first inventory item</p>
                                <Link to="/add-item" className="btn btn-primary" style={{ marginTop: '16px' }}>
                                    Add First Item
                                </Link>
                            </div>
                        ) : (
                            <div className="table-container" style={{ border: 'none', background: 'transparent' }}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>SKU</th>
                                            <th>Category</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentItems.map((item) => (
                                            <tr key={item._id || item.id}>
                                                <td>{item.name}</td>
                                                <td>{item.sku}</td>
                                                <td>{item.category}</td>
                                                <td>
                                                    <span
                                                        className={`badge ${item.quantity < 10
                                                                ? 'badge-danger'
                                                                : item.quantity < 25
                                                                    ? 'badge-warning'
                                                                    : 'badge-success'
                                                            }`}
                                                    >
                                                        {item.quantity}
                                                    </span>
                                                </td>
                                                <td>{formatCurrency(item.price)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Dashboard;
