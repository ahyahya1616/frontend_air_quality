import React from 'react';
import { Printer, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ReportView = ({ report, data, chartData, onClose }) => {
    const latest = data[0]?.payload || null;

    return (
        <div className="report-print-layout">
            <header className="report-header">
                <h1>Air Quality Analysis Report</h1>
                <p>Generated on: {new Date().toLocaleString()}</p>
                <button className="no-print btn-back" onClick={onClose}><X size={16} /> Exit Report</button>
                <button className="no-print btn-primary" onClick={() => window.print()}>
                    <Printer size={16} /> Print Report
                </button>
            </header>

            <section className="report-summary">
                <h2>Executive Summary</h2>
                <div className="summary-grid">
                    <div className="summary-item">
                        <span className="label">Overall Status</span>
                        <span className="value">{latest?.analysis?.prediction || 'N/A'}</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Total Samples</span>
                        <span className="value">{report?.summary?.totalRecords}</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Avg CO2</span>
                        <span className="value">{report?.analytics?.globalAverages?.avgCo2?.toFixed(2)} ppm</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Avg PM2.5</span>
                        <span className="value">{report?.analytics?.globalAverages?.avgPm25?.toFixed(2)} µg/m³</span>
                    </div>
                </div>
            </section>

            <section className="report-charts">
                <h2>Trend Analysis (Last 20 Readings)</h2>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="co2" stroke="#334155" fill="#94a3b8" />
                            <Area type="monotone" dataKey="pm25" stroke="#000000" fill="#cbd5e1" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </section>

            <section className="limit-disclaimer">
                <p>This report is computer-generated related to the IoT Air Quality Monitoring Project. The prediction model relies on Cloud AI Analysis.</p>
            </section>
        </div>
    );
};

export default ReportView;
