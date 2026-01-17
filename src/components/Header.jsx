import React from 'react';
import { RefreshCcw } from 'lucide-react';

const Header = ({ title, subtitle, onRefresh, loading }) => {
    return (
        <header className="top-bar">
            <div className="page-title">
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>
            <div className="header-actions">
                <button onClick={onRefresh} className="btn-icon" disabled={loading} title="Refresh Data">
                    <RefreshCcw size={18} className={loading ? 'spin' : ''} />
                </button>
            </div>
        </header>
    );
};

export default Header;
