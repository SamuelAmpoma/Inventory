import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Get user initials for avatar
    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="header">
            <div className="container header-content">
                <div className="logo">
                    <div className="logo-icon">📦</div>
                    <span>InventoryMS</span>
                </div>

                <nav className="nav">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/inventory"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        Inventory
                    </NavLink>
                    <NavLink
                        to="/add-item"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        Add Item
                    </NavLink>
                </nav>

                <div className="user-menu">
                    <div className="user-info">
                        <div className="user-avatar">{getInitials(user?.name)}</div>
                        <span>{user?.name}</span>
                    </div>
                    <button className="btn btn-secondary" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
