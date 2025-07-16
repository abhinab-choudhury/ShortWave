# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```


Here’s a **UI overview** along with some **relevant code snippets** for your **URL shortener analytics dashboard** using **Next.js, ShadCN, and Recharts**.

---

## **🔹 UI Overview**
The dashboard has two main pages:  
- **Dashboard Page (Overview)**
  - Key metrics (Total Clicks, URLs, QR Codes Generated)
  - Recent activity table (Short URLs, Clicks, Date)
  - Click trends graph (Last 7 days)
  - Top-performing URLs
  - Export data button  

- **Analytics Page (Detailed View)**
  - Search and filter (by URL, date, QR status)
  - Graphs: Click trends, Device usage, Geolocation breakdown
  - Heatmaps (Peak click times)
  - Full analytics table (UTM, referrer info, detailed stats)
  - A/B testing comparison  

---

## **🔹 UI Structure**
Here's how you should **structure your components**:

```
📂 src/
 ├── 📂 components/
 │   ├── 📄 StatCard.tsx
 │   ├── 📄 ClickTrendsChart.tsx
 │   ├── 📄 RecentActivityTable.tsx
 │   ├── 📄 TopUrlsTable.tsx
 │   ├── 📄 ExportDataButton.tsx
 │   ├── 📄 FilterBar.tsx
 │   ├── 📄 GeoLocationChart.tsx
 │   ├── 📄 DeviceUsageChart.tsx
 │   ├── 📄 ABTestingTable.tsx
 ├── 📂 pages/
 │   ├── 📄 dashboard.tsx
 │   ├── 📄 analytics.tsx
```

---

## **🔹 Implementing Features**
Here are **code snippets** for key UI features.

### **📊 1. Stat Cards (Dashboard Overview)**
```tsx
// components/StatCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card className="shadow-md rounded-xl p-4">
      <CardHeader className="flex items-center space-x-4">
        {icon}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
```

**Usage in `dashboard.tsx`:**
```tsx
<StatCard title="Total Clicks" value="12,345" icon={<ClickIcon />} />
<StatCard title="Total URLs" value="230" icon={<LinkIcon />} />
<StatCard title="QR Codes Generated" value="120" icon={<QrCodeIcon />} />
```

---

### **📈 2. Click Trends Chart (Using Recharts)**
```tsx
// components/ClickTrendsChart.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", clicks: 120 },
  { day: "Tue", clicks: 200 },
  { day: "Wed", clicks: 150 },
  { day: "Thu", clicks: 250 },
  { day: "Fri", clicks: 300 },
];

export function ClickTrendsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="clicks" stroke="#8884d8" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

**Usage in `dashboard.tsx`:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Click Trends (Last 7 Days)</CardTitle>
  </CardHeader>
  <CardContent>
    <ClickTrendsChart />
  </CardContent>
</Card>
```

---

### **📝 3. Recent Activity Table**
```tsx
// components/RecentActivityTable.tsx
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";

const recentUrls = [
  { shortUrl: "short.ly/abc", original: "https://example.com", clicks: 45, created: "2024-03-29" },
  { shortUrl: "short.ly/xyz", original: "https://openai.com", clicks: 78, created: "2024-03-28" },
];

export function RecentActivityTable() {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Short URL</TableHeader>
          <TableHeader>Original URL</TableHeader>
          <TableHeader>Clicks</TableHeader>
          <TableHeader>Date</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {recentUrls.map((url) => (
          <TableRow key={url.shortUrl}>
            <TableCell>{url.shortUrl}</TableCell>
            <TableCell>{url.original}</TableCell>
            <TableCell>{url.clicks}</TableCell>
            <TableCell>{url.created}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

**Usage in `dashboard.tsx`:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Recent Activity</CardTitle>
  </CardHeader>
  <CardContent>
    <RecentActivityTable />
  </CardContent>
</Card>
```

---

### **🌍 4. Geolocation Chart**
```tsx
// components/GeoLocationChart.tsx
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const geoData = [
  { country: "USA", value: 400 },
  { country: "India", value: 300 },
  { country: "Germany", value: 200 },
  { country: "France", value: 150 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function GeoLocationChart() {
  return (
    <PieChart width={400} height={300}>
      <Pie data={geoData} dataKey="value" nameKey="country" outerRadius={100} fill="#8884d8">
        {geoData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}
```

---

## **🔹 How to Structure UI?**
- **Dashboard Page:**  
  - ✅ Stat Cards (Total Clicks, URLs, QR Codes)  
  - ✅ Click Trends Chart  
  - ✅ Recent Activity Table  
  - ✅ Top URLs List  
  - ✅ Export Data Button  

- **Analytics Page:**  
  - 🔍 Search & Filter  
  - 📊 Advanced Charts (Geolocation, Device Usage, Heatmap)  
  - 🏆 A/B Testing  
  - 📋 Full Detailed Table  

---

## **🔹 Next Steps**
1. Implement the **API to fetch real analytics data** (using Next.js API routes).  
2. Add **dynamic filtering** (ShadCN’s dropdowns).  
3. Integrate **real-time updates** using WebSockets (optional for live click tracking).  

---

This **dashboard + analytics** approach will make your **URL shortener stand out**! 🚀  
Would you like a **Figma wireframe**, or should I generate more **specific feature code**?
