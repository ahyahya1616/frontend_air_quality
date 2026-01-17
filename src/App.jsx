import { useState, useEffect } from 'react';
import { fetchAllData, fetchReport, fetchRange } from './services/api';
import {
  Wind, Thermometer, Droplets, Activity, History,
  BarChart3, Filter, RefreshCcw, CheckCircle2, AlertCircle,
  Printer, FileText
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showReport, setShowReport] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [history, analytics] = await Promise.all([fetchAllData(), fetchReport()]);
      setData(history);
      setReport(analytics);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleFilter = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    try {
      setLoading(true);
      const filtered = await fetchRange(startDate, endDate);
      setData(filtered);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const latest = data[0]?.payload || null;

  // Prepare chart data (reverse to show chronological order left-to-right)
  const chartData = [...data].reverse().slice(-20).map(d => ({
    time: new Date(d.payload?.timestamp || d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    co2: d.payload?.sensors?.co2,
    pm25: d.payload?.sensors?.pm25
  }));

  if (loading && !data.length) {
    return (
      <div className="loading-state">
        <RefreshCcw className="spinner" size={48} />
        <p>Calibrating System...</p>
      </div>
    );
  }

  // Printable Report Mode
  if (showReport) {
    return (
      <div className="report-print-layout">
        <header className="report-header">
          <h1>Air Quality Analysis Report</h1>
          <p>Generated on: {new Date().toLocaleString()}</p>
          <button className="no-print btn-back" onClick={() => setShowReport(false)}>Exit Report</button>
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
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Activity size={24} />
          <span>AeroPulse AI</span>
        </div>
        <nav>
          <button className="nav-item active"><BarChart3 size={18} /> Dashboard</button>
          <button className="nav-item" onClick={() => setShowReport(true)}><FileText size={18} /> Generate Report</button>
        </nav>
      </aside>

      <main className="content-area">
        <header className="top-bar">
          <div className="page-title">
            <h1>Laboratory Monitor</h1>
            <p>Real-time environmental sensing</p>
          </div>
          <div className="header-actions">
            <button onClick={loadData} className="btn-icon">
              <RefreshCcw size={18} />
            </button>
          </div>
        </header>

        {error && (
          <div className="banner-error">
            <AlertCircle size={20} />
            <span>System Error: {error}</span>
          </div>
        )}

        {/* KPI CARDS */}
        <section className="stats-grid">
          {/* Custom Health Card */}
          <div className="stat-card main-status glass-panel">
            <div className="card-header">
              <Activity size={20} />
              <h3>Status</h3>
            </div>
            <div className="status-indicator">
              <div className={`status-icon ${latest?.analysis?.prediction?.toLowerCase() === 'clean' ? 'clean' : 'polluted'}`}>
                {latest?.analysis?.prediction?.toLowerCase() === 'clean' ? <CheckCircle2 size={36} /> : <AlertCircle size={36} />}
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

        {/* REAL-TIME CHARTS */}
        <section className="chart-section glass-panel">
          <div className="panel-header">
            <h2><BarChart3 size={18} /> Live Trends (CO2 & PM2.5)</h2>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#334155" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#334155" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="co2" stroke="#334155" strokeWidth={2} fillOpacity={1} fill="url(#colorCo2)" />
                <Area type="monotone" dataKey="pm25" stroke="#94a3b8" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* HISTORY TABLE */}
        <section className="dashboard-main">
          <div className="data-panel glass-panel">
            <div className="panel-header">
              <div className="header-text">
                <History size={18} />
                <h2>Data Logs</h2>
              </div>
              <form onSubmit={handleFilter} className="date-filter">
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <span className="separator">-</span>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                <button type="submit" className="btn-filter">Filter</button>
              </form>
            </div>

            <div className="table-wrapper">
              <table className="pro-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>CO2 (ppm)</th>
                    <th>PM2.5 (µg/m³)</th>
                    <th>Prediction</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 10).map((item, idx) => (
                    <tr key={item._id || idx}>
                      <td className="mono">{new Date(item.payload?.timestamp || item.timestamp).toLocaleTimeString()}</td>
                      <td className="mono">{item.payload?.sensors?.co2}</td>
                      <td className="mono">{item.payload?.sensors?.pm25}</td>
                      <td>
                        <span className={`status-dot ${item.payload?.analysis?.prediction?.toLowerCase() || 'inconnu'}`}></span>
                        {item.payload?.analysis?.prediction || 'NA'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
