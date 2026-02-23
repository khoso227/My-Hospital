import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pill, Plus, X, Package, ListPlus, Trash2, Calculator, Receipt, Printer } from 'lucide-react';

const PharmacyTab = () => {
    const [medicines, setMedicines] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [extraFields, setExtraFields] = useState([]); // For MG, Formula, etc.
    const [formData, setFormData] = useState({ 
        name: '', category: '', stock: 1, price: 0, discount: 0, received: 0 
    });

    // --- 1. PRINTING LOGIC (Merged) ---
    const printReceipt = (sale) => {
        const hospitalName = localStorage.getItem('hospitalName') || 'HOSPITAL PRO';
        const printWindow = window.open('', '_blank');
        
        // Dynamic Receipt HTML
        printWindow.document.write(`
            <html>
                <head>
                    <title>Pharmacy Receipt - ${sale.name}</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
                        .header { text-align: center; border-bottom: 3px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px; }
                        h1 { margin: 0; text-transform: uppercase; font-size: 32px; font-weight: 900; color: #1e40af; italic; }
                        .info-grid { display: grid; grid-cols: 2; margin-bottom: 30px; }
                        .bill-table { w-full: 100%; border-collapse: collapse; margin-top: 20px; width: 100%; }
                        .bill-table th { background: #f3f4f6; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
                        .bill-table td { padding: 12px; border-bottom: 1px solid #eee; }
                        .summary { margin-top: 30px; margin-left: auto; width: 300px; }
                        .summary-row { display: flex; justify-content: space-between; padding: 5px 0; font-weight: bold; }
                        .total-row { font-size: 20px; color: #1e40af; border-top: 2px solid #1e40af; margin-top: 10px; padding-top: 10px; }
                        .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
                        @media print { .no-print { display: none; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>${hospitalName}</h1>
                        <p style="letter-spacing: 2px; font-weight: bold;">PHARMACY DIVISION OFFICIAL RECEIPT</p>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <div>
                            <p><strong>Receipt No:</strong> #PH-${sale._id ? sale._id.slice(-6) : 'NEW'}</p>
                            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        <div style="text-align: right;">
                            <p><strong>Status:</strong> PAID</p>
                        </div>
                    </div>

                    <table class="bill-table">
                        <thead>
                            <tr>
                                <th>Medicine Item</th>
                                <th>Category</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>${sale.name}</strong></td>
                                <td>${sale.category}</td>
                                <td>${sale.stock}</td>
                                <td>Rs. ${sale.price}</td>
                                <td>Rs. ${sale.price * sale.stock}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="summary">
                        <div class="summary-row"><span>Gross Total:</span> <span>Rs. ${sale.price * sale.stock}</span></div>
                        <div class="summary-row" style="color: red;"><span>Discount (${sale.discount}%):</span> <span>- Rs. ${(sale.price * sale.stock * sale.discount) / 100}</span></div>
                        <div class="summary-row total-row"><span>NET PAYABLE:</span> <span>Rs. ${(sale.price * sale.stock) - (sale.price * sale.stock * sale.discount / 100)}</span></div>
                        <div class="summary-row" style="margin-top: 10px;"><span>Cash Received:</span> <span>Rs. ${sale.received}</span></div>
                        <div class="summary-row" style="color: #1e40af;"><span>Change Returned:</span> <span>Rs. ${sale.change || 0}</span></div>
                    </div>

                    <div class="footer">
                        <p>This is a computer-generated receipt from ${hospitalName} Smart SaaS System.</p>
                        <p>Thank you for choosing us for your healthcare needs.</p>
                    </div>

                    <script>
                        window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    // --- 2. DATA FETCHING ---
    const fetchMedicines = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/medicines');
            if (res.data.success) setMedicines(res.data.data);
        } catch (err) { 
            console.log("Error: Check if route is added in index.js"); 
        }
    };

    useEffect(() => { fetchMedicines(); }, []);

    // --- 3. LIVE CALCULATIONS ---
    const subTotal = formData.price * formData.stock;
    const discountAmt = (subTotal * formData.discount) / 100;
    const totalToPay = subTotal - discountAmt;
    const changeToReturn = formData.received > 0 ? formData.received - totalToPay : 0;

    // --- 4. DYNAMIC COLUMNS LOGIC ---
    const addColumn = () => setExtraFields([...extraFields, { label: '', value: '' }]);
    const removeColumn = (index) => setExtraFields(extraFields.filter((_, i) => i !== index));
    const handleExtraChange = (index, key, val) => {
        const updated = [...extraFields];
        updated[index][key] = val;
        setExtraFields(updated);
    };

    // --- 5. SUBMIT TO BACKEND ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const finalData = { 
                ...formData, 
                change: changeToReturn, 
                extraDetails: extraFields 
            };
            const res = await axios.post('http://localhost:5000/api/medicines/add', finalData);
            if (res.data.success) {
                // Auto-Print Receipt after saving
                printReceipt({ ...finalData, _id: res.data.data._id });
                
                setIsModalOpen(false);
                setFormData({ name: '', category: '', stock: 1, price: 0, discount: 0, received: 0 });
                setExtraFields([]);
                fetchMedicines();
            }
        } catch (err) { alert("Server Error! Check Backend Connectivity."); }
    };

    const hospitalName = localStorage.getItem('hospitalName') || 'HOSPITAL PRO';

    return (
        <div className="p-6">
            {/* --- Header --- */}
            <div className="flex justify-between items-center bg-white p-8 rounded-[35px] shadow-sm mb-6 border-b-4 border-blue-600">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-50 rounded-2xl text-blue-600"><Pill size={32} /></div>
                    <div>
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-800">{hospitalName} Pharmacy</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inventory & Sales Management</p>
                    </div>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl flex items-center gap-2 font-black shadow-lg hover:scale-105 transition-all">
                    <Plus size={24} /> NEW ENTRY / SALE
                </button>
            </div>

            {/* --- Table --- */}
            <div className="bg-white rounded-[40px] shadow-sm overflow-hidden border">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                        <tr>
                            <th className="p-6">Medicine & Details</th>
                            <th className="p-6 text-center">Qty x Price</th>
                            <th className="p-6 text-center">Discount</th>
                            <th className="p-6 text-center">Paid</th>
                            <th className="p-6 text-blue-600 text-center">Return</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.map(med => (
                            <tr key={med._id} className="border-t hover:bg-gray-50 transition-colors group">
                                <td className="p-6">
                                    <div className="font-black text-gray-800 text-lg">{med.name}</div>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <span className="text-[9px] bg-gray-100 px-2 py-0.5 rounded font-bold text-gray-500 uppercase">{med.category}</span>
                                        {med.extraDetails?.map((ex, i) => (
                                            <span key={i} className="text-[9px] bg-blue-50 px-2 py-0.5 rounded font-bold text-blue-600 uppercase">{ex.label}: {ex.value}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <div className="font-bold text-gray-700 font-mono">Rs. {med.price * med.stock}</div>
                                    <div className="text-[10px] text-gray-400">{med.stock} units</div>
                                </td>
                                <td className="p-6 text-center font-black text-red-500 font-mono">{med.discount}%</td>
                                <td className="p-6 text-center font-black text-green-600 font-mono">Rs. {med.received}</td>
                                <td className="p-6 text-center bg-blue-50/30">
                                    <span className="font-black text-blue-700 text-lg font-mono">Rs. {med.change}</span>
                                </td>
                                <td className="p-6 text-right">
                                    <button 
                                        onClick={() => printReceipt(med)}
                                        className="p-3 bg-gray-100 rounded-xl text-gray-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                        title="Print Receipt"
                                    >
                                        <Printer size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- Integrated Billing & Stock Modal --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-blue-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[50px] w-full max-w-5xl p-10 shadow-2xl flex gap-8 animate-in zoom-in-95">
                        
                        {/* Left Side: Entry Form */}
                        <div className="flex-1 space-y-4 overflow-y-auto max-h-[75vh] pr-4">
                            <h2 className="text-2xl font-black italic text-blue-800 uppercase flex items-center gap-2">
                                <Receipt /> Pharmacy Transaction
                            </h2>
                            
                            <div className="space-y-3">
                                <input placeholder="Medicine Name" className="w-full border-2 p-4 rounded-2xl font-bold outline-none focus:border-blue-500" required onChange={e => setFormData({...formData, name: e.target.value})} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="Category (e.g. Antibiotic)" className="w-full border-2 p-4 rounded-2xl font-bold outline-none" onChange={e => setFormData({...formData, category: e.target.value})} />
                                    <input type="number" placeholder="Price per Unit" className="w-full border-2 p-4 rounded-2xl font-bold text-blue-600 outline-none font-mono" onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" placeholder="Quantity" className="w-full border-2 p-4 rounded-2xl font-bold outline-none" onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                                    <input type="number" placeholder="Discount %" className="w-full border-2 p-4 rounded-2xl font-bold text-red-500 outline-none" onChange={e => setFormData({...formData, discount: Number(e.target.value)})} />
                                </div>
                            </div>

                            {/* Dynamic Extra Columns Area */}
                            <div className="bg-gray-50 p-6 rounded-[30px] border-2 border-dashed border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Specifications (MG, Formula, etc.)</p>
                                    <button type="button" onClick={addColumn} className="text-blue-600 font-black text-[10px] bg-blue-100 px-3 py-1 rounded-full">+ ADD COLUMN</button>
                                </div>
                                {extraFields.map((field, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2 items-center">
                                        <input placeholder="Label" className="w-1/3 border-2 border-white p-2 rounded-xl text-xs font-bold shadow-sm" value={field.label} onChange={e => handleExtraChange(idx, 'label', e.target.value)} />
                                        <input placeholder="Value" className="w-full border-2 border-white p-2 rounded-xl text-xs font-black text-blue-600 shadow-sm" value={field.value} onChange={e => handleExtraChange(idx, 'value', e.target.value)} />
                                        <button type="button" onClick={() => removeColumn(idx)} className="text-red-400 p-1 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                            </div>

                            <input type="number" placeholder="Cash Received from Customer" className="w-full border-4 p-5 rounded-3xl font-black text-3xl text-green-600 border-green-100 bg-green-50/30 outline-none focus:border-green-400 font-mono shadow-inner" onChange={e => setFormData({...formData, received: Number(e.target.value)})} />
                        </div>

                        {/* Right Side: Dark Calculator */}
                        <div className="w-80 bg-slate-900 rounded-[45px] p-8 text-white flex flex-col justify-between shadow-2xl">
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Calculator size={16}/> Instant Billing
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Total Bill:</span>
                                        <span className="font-bold font-mono text-lg">Rs. {subTotal}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-red-400">
                                        <span>Discount:</span>
                                        <span className="font-bold font-mono">- Rs. {discountAmt}</span>
                                    </div>
                                    <div className="h-px bg-slate-800 my-2"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Net Payable</span>
                                        <span className="text-4xl font-black text-blue-400 tracking-tighter font-mono mt-1">Rs. {totalToPay}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 bg-blue-600 rounded-[30px] text-center shadow-lg shadow-blue-900/50">
                                    <p className="text-[10px] font-black uppercase mb-1 opacity-80">Change to Return</p>
                                    <h4 className="text-3xl font-black tracking-tighter font-mono">Rs. {changeToReturn}</h4>
                                </div>

                                <button onClick={handleSubmit} className="w-full bg-white text-slate-900 py-6 rounded-[30px] font-black text-lg hover:bg-blue-400 hover:text-white transition-all transform active:scale-95 shadow-xl">
                                    FINALIZE & PRINT
                                </button>
                                <button onClick={() => setIsModalOpen(false)} className="w-full text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Discard</button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default PharmacyTab;