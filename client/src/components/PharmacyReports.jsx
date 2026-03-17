// client/src/components/PharmacyReports.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PharmacyReports = () => {
  const [reportType, setReportType] = useState('overview');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reportRef = useRef(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    setReportData(null);

    try {
      const params = { reportType };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await axios.get('https://my-hospital-odec.vercel.app/api/pharmacy/reports', { params });

      if (!res.data || Object.keys(res.data).length === 0) {
        throw new Error('No data returned from server');
      }

      setReportData(res.data);
    } catch (err) {
      console.error('Report fetch error:', err);

      let errorMessage = 'Failed to load report. Please try again.';

      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'Report endpoint not found. Check if backend route is correct.';
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Check backend console for details.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        errorMessage = 'Cannot connect to server. Is backend running on port 5000?';
      } else {
        errorMessage = err.message || 'Unexpected error.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReport();
  };

  const exportToPDF = async () => {
    if (!reportRef.current) {
      alert('No report to export.');
      return;
    }
    if (!reportData) {
      alert('Generate report first.');
      return;
    }

    try {
      // Small delay helps charts render fully before capture
      await new Promise(resolve => setTimeout(resolve, 800));

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('portrait', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      const fileName = `Pharmacy_${reportType}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF generation failed. Try again or check console.');
    }
  };

  const chartData = reportData?.dispensedReport?.topMedicines
    ? {
        labels: reportData.dispensedReport.topMedicines.map(m => m._id || 'Unknown'),
        datasets: [{
          label: 'Revenue (PKR)',
          data: reportData.dispensedReport.topMedicines.map(m => m.totalRevenue || 0),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
      }
    : null;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Pharmacy Reports</h2>

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <label>Report Type: </label>
          <select value={reportType} onChange={e => setReportType(e.target.value)}>
            <option value="overview">Overview</option>
            <option value="dispensed">Dispensed / Sales</option>
            <option value="stock">Stock Status</option>
            <option value="expiry">Expiry Alerts</option>
          </select>
        </div>

        <button
          onClick={exportToPDF}
          disabled={loading || !reportData || !!error}
          style={{
            padding: '10px 20px',
            background: error ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: (loading || !reportData || error) ? 'not-allowed' : 'pointer'
          }}
        >
          Download PDF
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <label>From: </label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <label style={{ marginLeft: '20px' }}>To: </label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <button type="submit" disabled={loading} style={{ marginLeft: '20px' }}>
          {loading ? 'Loading...' : 'Generate'}
        </button>
      </form>

      {error && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '15px',
          borderRadius: '8px',
          margin: '0 0 20px 0',
          border: '1px solid #ef9a9a'
        }}>
          <strong>Error:</strong> {error}
          <br />
          <button
            onClick={fetchReport}
            style={{ marginTop: '10px', padding: '8px 16px', background: '#c62828', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Retry
          </button>
        </div>
      )}

      <div
        ref={reportRef}
        style={{
          background: 'white',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          minHeight: '300px'
        }}
      >
        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Loading report...</p>
        ) : error ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Error – see message above</p>
        ) : !reportData ? (
          <p style={{ textAlign: 'center', color: '#888' }}>
            Select report type and dates, then click Generate
          </p>
        ) : (
          <>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
              {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
              {startDate && endDate && ` (${startDate} – ${endDate})`}
            </h3>

            {reportType === 'overview' && reportData.stockOverview && (
              <div>
                <h4>Stock Overview</h4>
                <p><strong>Total Medicines:</strong> {reportData.stockOverview.totalMedicines}</p>
                <p><strong>Total Stock Value:</strong> PKR {reportData.stockOverview.totalStockValue?.toFixed(2) || '0.00'}</p>
                <p style={{ color: reportData.stockOverview.lowStockCount > 0 ? 'red' : 'green' }}>
                  <strong>Low Stock Items:</strong> {reportData.stockOverview.lowStockCount}
                </p>
                <p style={{ color: reportData.stockOverview.nearExpiryCount > 0 ? 'orange' : 'green' }}>
                  <strong>Near Expiry (30 days):</strong> {reportData.stockOverview.nearExpiryCount}
                </p>
              </div>
            )}

            {reportType === 'dispensed' && reportData.dispensedReport && (
              <div>
                <h4>Dispensed / Sales Report</h4>
                <p><strong>Total Items Dispensed:</strong> {reportData.dispensedReport.totalDispensedItems}</p>
                <p><strong>Total Revenue:</strong> PKR {reportData.dispensedReport.totalRevenue?.toFixed(2) || '0.00'}</p>

                {chartData && (
                  <div style={{ maxWidth: '700px', margin: '30px auto' }}>
                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'top' },
                          title: { display: true, text: 'Top 10 Medicines by Revenue' }
                        }
                      }}
                    />
                  </div>
                )}

                <h5>Top Medicines</h5>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                  <thead>
                    <tr style={{ background: '#f5f5f5' }}>
                      <th style={{ padding: '10px', border: '1px solid #ddd' }}>Medicine</th>
                      <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total Dispensed</th>
                      <th style={{ padding: '10px', border: '1px solid #ddd' }}>Revenue (PKR)</th>
                      <th style={{ padding: '10px', border: '1px solid #ddd' }}>Last Dispensed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.dispensedReport.topMedicines.map((m, i) => (
                      <tr key={i}>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{m._id}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{m.totalDispensed}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>{m.totalRevenue.toFixed(2)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(m.lastDispensed).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {reportType === 'expiry' && reportData.expiryReport && (
              <div>
                <h4>Expiry Report (90 days)</h4>
                <p><strong>Near Expiry Items:</strong> {reportData.expiryReport.nearExpiryCount}</p>

                {reportData.expiryReport.items?.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                      <tr style={{ background: '#f5f5f5' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Medicine</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Batch</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Expiry Date</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.expiryReport.items.map((item, i) => (
                        <tr key={i}>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.name}</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.batch}</td>
                          <td style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                            color: new Date(item.expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'red' : 'orange'
                          }}>
                            {item.expiry}
                          </td>
                          <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{item.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No items nearing expiry in the next 90 days.</p>
                )}
              </div>
            )}

            {/* Add stock report rendering if backend supports it separately */}
          </>
        )}
      </div>
    </div>
  );
};

export default PharmacyReports;