import React from 'react';
import { Cpu, Activity, Zap, CheckCircle2, AlertCircle, Fan, Power } from 'lucide-react';

const HardwareStatus = ({ sensors, actuators }) => {
    return (
        <section className="hardware-section glass-panel" style={{ marginTop: '2rem' }}>
            <div className="panel-header">
                <h2><Cpu size={18} /> Hardware Infrastructure</h2>
            </div>
            <div className="hardware-grid">
                {/* SENSORS LIST */}
                <div className="hardware-group">
                    <h3><Activity size={16} /> Sensor Array Status</h3>
                    <div className="device-list">
                        {sensors.map((s, i) => (
                            <div key={i} className={`device-item ${s.status}`}>
                                <div className="device-info">
                                    <span className="device-name">{s.name}</span>
                                    <span className="device-type">{s.functionality}</span>
                                </div>
                                <div className="device-status">
                                    {s.status === 'working' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    <span>{s.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ACTUATORS LIST */}
                <div className="hardware-group">
                    <h3><Zap size={16} /> Active Control Systems</h3>
                    <div className="device-list">
                        {actuators.map((a, i) => (
                            <div key={i} className={`device-item actuator ${a.pumpState === 'ON' ? 'active' : 'inactive'}`}>
                                <div className="device-icon">
                                    {a.functionality === 'ventilation' ? <Fan size={24} className={a.pumpState === 'ON' ? 'spin' : ''} /> : <Power size={24} />}
                                </div>
                                <div className="device-info">
                                    <span className="device-name">{a.name}</span>
                                    <span className={`state-badge ${a.pumpState}`}>{a.pumpState}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HardwareStatus;
