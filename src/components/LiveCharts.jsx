import React from 'react';
import { BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const LiveCharts = ({ chartData }) => {
    return (
        <section className="chart-section glass-panel">
            <div className="panel-header">
                <h2><BarChart3 size={18} /> Live Trends (Multi-Metric)</h2>
            </div>
            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#334155" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#334155" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPm25" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#64748b" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                            itemStyle={{ fontSize: '0.875rem' }}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" />

                        {/* CO2 - Dark Slate */}
                        <Area type="monotone" name="CO2 (ppm)" dataKey="co2" stroke="#334155" strokeWidth={2} fill="url(#colorCo2)" />

                        {/* PM 2.5 - Gray */}
                        <Area type="monotone" name="PM 2.5 (µg/m³)" dataKey="pm25" stroke="#64748b" strokeWidth={2} fill="url(#colorPm25)" />

                        {/* Humidity - Cyan/Blue */}
                        <Area type="monotone" name="Humidity (%)" dataKey="hum" stroke="#0ea5e9" strokeWidth={2} fill="transparent" />

                        {/* Temperature - Orange/Red */}
                        <Area type="monotone" name="Temp (°C)" dataKey="temp" stroke="#f97316" strokeWidth={2} fill="transparent" />

                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
};

export default LiveCharts;
