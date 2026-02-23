<Link to="/pharmacy/reports">View Reports</Link>// client/src/components/PharmacyDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PharmacyDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/pharmacy/inventory')
      .then(res => {
        setInventory(res.data.inventory);
        setLowStock(res.data.lowStock);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Pharmacy Dashboard</h2>
      {lowStock.length > 0 && (
        <div style={{ color: 'red' }}>
          <h3>Low Stock Alerts:</h3>
          <ul>{lowStock.map(item => <li key={item._id}>{item.medicineName} - Stock: {item.stock}</li>)}</ul>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Expiry</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item._id}>
              <td>{item.medicineName}</td>
              <td>{item.stock}</td>
              <td>{item.price}</td>
              <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PharmacyDashboard;