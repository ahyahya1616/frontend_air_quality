import { useState, useEffect } from 'react';
import { fetchAllData, fetchReport, fetchRange, fetchSensors, fetchActuators } from './services/api';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import './App.css';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import LiveCharts from './components/LiveCharts';
import HardwareStatus from './components/HardwareStatus';
import HistoryTable from './components/HistoryTable';
import ReportView from './components/ReportView';

function App() {
  const [data, setData] = useState([]);
  const [report, setReport] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [actuators, setActuators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showReport, setShowReport] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [history, analytics, hardwareSensors, hardwareActuators] = await Promise.all([
        fetchAllData(),
        fetchReport(),
        fetchSensors(),
        fetchActuators()
      ]);
      setData(history || []);
      setReport(analytics);
      setSensors(hardwareSensors.data || []);
      setActuators(hardwareActuators.data || []);
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
      setData(filtered || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const latest = data[0]?.payload || null;

  // Prepare chart data (chronological) & include ALL metrics
  const chartData = [...data].reverse().slice(-20).map(d => ({
    time: new Date(d.payload?.timestamp || d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    co2: d.payload?.sensors?.co2 || 0,
    pm25: d.payload?.sensors?.pm25 || 0,
    temp: d.payload?.sensors?.temp || 0,
    hum: d.payload?.sensors?.hum || 0
  }));

  // Initial Loading Screen
  if (loading && !data.length) {
    return (
      <div className="loading-state">
        <RefreshCcw className="spinner" size={48} />
        <p>Initializing System...</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Sidebar is now ALWAYS visible (unless printing) */}
      <Sidebar
        onShowReport={setShowReport}
        activeTab={showReport ? 'report' : 'dashboard'}
      />

      <main className="content-area">
        {showReport ? (
          // Render Report Logic INSIDE content area
          <ReportView
            report={report}
            data={data}
            chartData={chartData}
            onClose={() => setShowReport(false)}
          />
        ) : (
          // Render Default Dashboard
          <>
            <Header
              title="Laboratory Monitor"
              subtitle="Real-time environmental sensing"
              onRefresh={loadData}
              loading={loading}
            />

            {error && (
              <div className="banner-error">
                <AlertCircle size={20} />
                <span>System Error: {error}</span>
              </div>
            )}

            <StatsGrid latest={latest} />

            <LiveCharts chartData={chartData} />

            <HardwareStatus sensors={sensors} actuators={actuators} />

            {/* Pass state for pagination logic (handled in component) */}
            <HistoryTable
              data={data}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onFilter={handleFilter}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
