# 📦 Parcelo – Courier Management System

**Parcelo** is a lightweight courier management dashboard built as a **single HTML file** with its own CSS and JavaScript. No build step, no dependencies, no backend. Open the file in a browser and you're running.

It features an indigo sidebar with violet, teal, coral and blue accent cards, a light/dark theme toggle, and a layout that works on desktop and mobile.

> 📸 **Screenshot:** add one here, e.g. `![Parcelo dashboard](docs/screenshot.png)`

---

## ✨ Features

### Dashboard
- Icon sidebar with a menu button
- Top bar with logo, search, notification badge and user profile
- Row of stat cards (violet, teal, coral and blue)
- **Recent shipments** table with status badges and progress pills
- **Deliveries by city** bar panel

### Shipments
- Create new shipments
- Search and filter shipments
- Change a shipment's status from a dropdown
- Delete shipments

### Couriers
- View each courier's **active** and **total** shipment counts
- Toggle couriers **on duty / off duty**

### Track
- Enter a shipment ID (for example `PCL-1002`) to see its status timeline

### Data
- Sample data ships as a JSON block inside the file
- Changes are saved in your browser
- **Copy** the current data as JSON
- **Paste and apply** a JSON backup
- **Reset** to the original sample data

### Other
- Responsive layout with a slide-out menu on mobile
- Light / dark mode toggle

---

## 🚀 Getting Started

1. **Clone or download** the repository:
   ```bash
   git clone https://github.com/jalalkhan10061986/parcelo.git
   cd parcelo
   ```
2. **Open the file** in any modern browser:
   - Double-click `index.html`, or
   - Serve it locally, for example:
     ```bash
     python3 -m http.server 8000
     ```
     then visit `http://localhost:8000`.

That's it. There is nothing to install.

> If your file has a different name than `index.html`, adjust the commands above.

---

## 🧭 Usage Guide

| Tab | What you can do |
|---|---|
| **Dashboard** | See stats, recent shipments and deliveries by city |
| **Shipments** | Create, search, filter, update status, delete |
| **Couriers** | Check workloads and toggle on/off duty |
| **Track** | Look up a shipment by ID (try `PCL-1002`) |
| **Data** | Copy JSON, apply a backup, or reset to sample data |

### Backing up and restoring data

1. Open the **Data** tab.
2. Click **Copy JSON** and save the output somewhere safe (a `.json` file works well).
3. To restore, paste the JSON into the text area and click **Apply**.
4. To start fresh, click **Reset** to return to the built-in sample data.

---

## 🗂️ Data Format

The initial data lives in a JSON block embedded in the HTML file and is then persisted in your browser's storage. Because storage is per-browser, data is **not shared between devices or browsers**. Use the Data tab to move it around.

Typical records include shipments (ID, status, city, courier, progress) and couriers (name, on/off duty status). Check the embedded JSON block in the file for the exact shape.

---

## 🛠️ Tech Stack

- HTML5
- CSS3 (custom properties for theming, responsive layout)
- Vanilla JavaScript (no frameworks or libraries)
- Browser storage for persistence

---

## ⚠️ Limitations

- Data is stored locally in the browser; there is no server or database.
- Clearing your browser data will erase saved changes (back up with the Data tab).
- There is no authentication; the user profile in the top bar is for display only.

---

## 🗺️ Ideas for the Future

- Backend API and database
- User accounts and roles
- Map view for deliveries
- CSV / PDF export
- Real-time notifications

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push the branch: `git push origin feature/my-feature`
5. Open a pull request

---

## 📄 License

Add your license here (for example, MIT) and include a `LICENSE` file in the repository.
