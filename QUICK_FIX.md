# 🚨 QUICK FIX - White Screen Issue

## Problem:
- White screen aa raha hai
- `App.jsx` me 500 error
- Packages install nahi ho rahi

## Solution - Ye EXACT steps follow karo:

### Method 1: Batch File (Easiest)

1. **File Explorer me jao:**
   - `E:\hospital_management\client` folder me jao

2. **`install.bat` file par double-click karo**
   - Ye automatically `npm install` run karega

3. **Agar error aaye, to Method 2 try karo**

---

### Method 2: PowerShell (Manual)

1. **PowerShell ko Administrator mode me kholo:**
   - Windows Start → "PowerShell" search karo
   - Right-click → "Run as Administrator"

2. **Ye commands run karo:**
   ```powershell
   cd E:\hospital_management\client
   npm install
   ```

3. **Wait karo 2-3 minutes** - packages install hote dikhengi

4. **Verify karo:**
   ```powershell
   Test-Path node_modules\react
   ```
   - Agar `True` aaye, to success!

5. **Dev server start karo:**
   ```powershell
   npm run dev
   ```

---

### Method 3: If npm install fails

Agar `npm install` me error aaye, to ye try karo:

```powershell
cd E:\hospital_management\client
npm cache clean --force
npm install --force
```

Ya phir:

```powershell
cd E:\hospital_management\client
npm install --legacy-peer-deps
```

---

## After Installation:

1. **Verify packages:**
   ```powershell
   Test-Path node_modules\axios
   Test-Path node_modules\react-router-dom
   Test-Path node_modules\react-toastify
   ```
   - Sab me `True` aana chahiye

2. **Start dev server:**
   ```powershell
   npm run dev
   ```

3. **Browser me jao:**
   - `http://localhost:5173`
   - Login page dikhna chahiye!

---

## Still Not Working?

Agar phir bhi white screen aaye:

1. Browser me F12 kholo
2. Console tab me jo error dikhe uska screenshot share karo
3. Ya terminal me jo error dikhe uska text copy-paste karo

---

**Ab `install.bat` file par double-click karo ya PowerShell me manually `npm install` run karo!**
