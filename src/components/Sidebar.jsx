import React from 'react';
import { Activity, BarChart3, FileText, LayoutDashboard } from 'lucide-react';

const Sidebar = ({ onShowReport, activeTab }) => {
    return (
        <aside className="sidebar">
            <div className="brand">
                <Activity size={24} />
                <span>AeroPulse AI</span>
            </div>
            <nav>
                <button
                    className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => onShowReport(false)}
                >
                    <BarChart3 size={18} /> Dashboard
                </button>
                <button
                    className={`nav-item ${activeTab === 'report' ? 'active' : ''}`}
                    onClick={() => onShowReport(true)}
                >
                    <FileText size={18} /> Generate Report
                </button>
            </nav>
        </aside>
    );
};

export default Sidebar;
