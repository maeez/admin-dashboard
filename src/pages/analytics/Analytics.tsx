import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./analytics.scss";

const revenueData = [
  { month: "Jan", revenue: 32000, expenses: 18000 },
  { month: "Feb", revenue: 41000, expenses: 22000 },
  { month: "Mar", revenue: 38000, expenses: 20000 },
  { month: "Apr", revenue: 51000, expenses: 27000 },
  { month: "May", revenue: 47000, expenses: 25000 },
  { month: "Jun", revenue: 60000, expenses: 31000 },
  { month: "Jul", revenue: 55000, expenses: 29000 },
  { month: "Aug", revenue: 68000, expenses: 35000 },
  { month: "Sep", revenue: 72000, expenses: 38000 },
  { month: "Oct", revenue: 65000, expenses: 33000 },
  { month: "Nov", revenue: 80000, expenses: 42000 },
  { month: "Dec", revenue: 95000, expenses: 48000 },
];

const userAcquisitionData = [
  { month: "Jan", organic: 400, paid: 240, referral: 180 },
  { month: "Feb", organic: 530, paid: 310, referral: 220 },
  { month: "Mar", organic: 480, paid: 280, referral: 200 },
  { month: "Apr", organic: 620, paid: 400, referral: 290 },
  { month: "May", organic: 590, paid: 360, referral: 270 },
  { month: "Jun", organic: 710, paid: 480, referral: 340 },
  { month: "Jul", organic: 660, paid: 420, referral: 310 },
  { month: "Aug", organic: 780, paid: 530, referral: 390 },
  { month: "Sep", organic: 820, paid: 560, referral: 420 },
  { month: "Oct", organic: 740, paid: 490, referral: 360 },
  { month: "Nov", organic: 900, paid: 640, referral: 480 },
  { month: "Dec", organic: 980, paid: 710, referral: 530 },
];

const categoryData = [
  { name: "Electronics", value: 35 },
  { name: "Computers", value: 25 },
  { name: "Phones", value: 20 },
  { name: "Accessories", value: 12 },
  { name: "Audio", value: 5 },
  { name: "Appliances", value: 3 },
];

const PIE_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c43", "#a05195", "#2f4b7c"];

const Analytics = () => {
  return (
    <div className="analytics">
      <div className="analyticsHeader">
        <h1>Analytics</h1>
        <span className="subtitle">Deep-dive reporting &amp; insights</span>
      </div>

      <div className="statsRow">
        <div className="statCard">
          <span className="statLabel">Total Revenue</span>
          <span className="statValue">$704,000</span>
          <span className="statChange positive">+18.4% vs last year</span>
        </div>
        <div className="statCard">
          <span className="statLabel">Total Users Acquired</span>
          <span className="statValue">8,213</span>
          <span className="statChange positive">+23.1% vs last year</span>
        </div>
        <div className="statCard">
          <span className="statLabel">Avg. Order Value</span>
          <span className="statValue">$342</span>
          <span className="statChange negative">-4.2% vs last year</span>
        </div>
        <div className="statCard">
          <span className="statLabel">Conversion Rate</span>
          <span className="statValue">3.8%</span>
          <span className="statChange positive">+0.6% vs last year</span>
        </div>
      </div>

      <div className="chartsGrid">
        <div className="chartCard wide">
          <h2>Revenue vs Expenses</h2>
          <p className="chartDesc">Monthly revenue and expense trends over the past year</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
              <XAxis dataKey="month" stroke="#ddd" />
              <YAxis stroke="#ddd" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: number | undefined) => [`${value ?? 0}%`, "Share"]}
                contentStyle={{ background: "#2a3447", border: "none", color: "white" }}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="expenses" stroke="#82ca9d" fillOpacity={1} fill="url(#colorExpenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chartCard wide">
          <h2>User Acquisitions by Channel</h2>
          <p className="chartDesc">Monthly breakdown of new users by acquisition channel</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={userAcquisitionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
              <XAxis dataKey="month" stroke="#ddd" />
              <YAxis stroke="#ddd" />
              <Tooltip contentStyle={{ background: "#2a3447", border: "none", color: "white" }} />
              <Legend />
              <Bar dataKey="organic" fill="#8884d8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="paid" fill="#ffc658" radius={[4, 4, 0, 0]} />
              <Bar dataKey="referral" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chartCard">
          <h2>Product Category Distribution</h2>
          <p className="chartDesc">Revenue share by product category</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {categoryData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
               formatter={(value: number | undefined) => [`${value ?? 0}%`, "Share"]}
                contentStyle={{ background: "#2a3447", border: "none", color: "white" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chartCard summaryCard">
          <h2>Category Breakdown</h2>
          <p className="chartDesc">Top categories by revenue share</p>
          <div className="categoryList">
            {categoryData.map((cat, i) => (
              <div className="categoryRow" key={cat.name}>
                <div className="catLeft">
                  <span className="catDot" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="catName">{cat.name}</span>
                </div>
                <div className="catRight">
                  <div className="catBar">
                    <div className="catFill" style={{ width: `${cat.value}%`, backgroundColor: PIE_COLORS[i] }} />
                  </div>
                  <span className="catValue">{cat.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
