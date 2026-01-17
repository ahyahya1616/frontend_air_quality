import React from 'react';
import { Activity, Wind, Thermometer, Droplets, CheckCircle2, AlertCircle } from 'lucide-react';

const StatsGrid = ({ latest }) => {
    const isClean = latest?.analysis?.prediction?.toLowerCase() === 'clean';

    return (
        <section className="stats-grid">
            {/* Custom Health Card */}
            <div className="stat-card main-status glass-panel">
                <div className="card-header">
                    <Activity size={20} />
                    <h3>Status</h3>
                </div>
                <div className="status-indicator">
                    <div className={`status-icon ${isClean ? 'clean' : 'polluted'}`}>
                        {isClean ? <CheckCircle2 size={36} /> : <AlertCircle size={36} />}
                    </div>
                    <div className="status-text">
                        <span className="status-val">{latest?.analysis?.prediction || 'Syncing'}</span>
                        <span className="status-sub">AI Confidence: {(latest?.analysis?.probability * 100 || 0).toFixed(0)}%</span>
                    </div>
                </div>
            </div>

            <div className="stat-card glass-panel">
                <div className="card-header"><Wind size={20} /><h3>CO2</h3></div>
                <div className="card-body">
                    <span className="value">{latest?.sensors?.co2 || 0}</span><span className="unit">ppm</span>
                </div>
            </div>

            <div className="stat-card glass-panel">
                <div className="card-header"><Wind size={20} /><h3>PM 2.5</h3></div>
                <div className="card-body">
                    <span className="value">{latest?.sensors?.pm25 || 0}</span><span className="unit">µg/m³</span>
                </div>
            </div>

            <div className="stat-card glass-panel">
                <div className="card-header"><Thermometer size={20} /><h3>Temp</h3></div>
                <div className="card-body">
                    <span className="value">{latest?.sensors?.temp || 0}</span><span className="unit">°C</span>
                </div>
            </div>

            <div className="stat-card glass-panel">
                <div className="card-header"><Droplets size={20} /><h3>Humidity</h3></div>
                <div className="card-body">
                    <span className="value">{latest?.sensors?.hum || 0}</span><span className="unit">%</span>
                </div>
            </div>
        </section>
    );
};

export default StatsGrid;
