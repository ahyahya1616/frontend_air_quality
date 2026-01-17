import React, { useState } from 'react';
import { History, ChevronLeft, ChevronRight } from 'lucide-react';

const HistoryTable = ({ data, startDate, endDate, onStartDateChange, onEndDateChange, onFilter }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Number of logs per page

    // Logic for displaying current logs
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(page => page + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(page => page - 1);
    };

    return (
        <section className="dashboard-main">
            <div className="data-panel glass-panel">
                <div className="panel-header">
                    <div className="header-text">
                        <History size={18} />
                        <h2>Data Logs ({data.length} records)</h2>
                    </div>
                    <form onSubmit={onFilter} className="date-filter">
                        <input type="date" value={startDate} onChange={e => onStartDateChange(e.target.value)} />
                        <span className="separator">-</span>
                        <input type="date" value={endDate} onChange={e => onEndDateChange(e.target.value)} />
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
                            {currentItems.map((item, idx) => (
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
                            {currentItems.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {data.length > itemsPerPage && (
                    <div className="pagination-controls">
                        <button onClick={prevPage} disabled={currentPage === 1} className="page-btn">
                            <ChevronLeft size={16} /> Previous
                        </button>
                        <span className="page-info">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button onClick={nextPage} disabled={currentPage === totalPages} className="page-btn">
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default HistoryTable;
