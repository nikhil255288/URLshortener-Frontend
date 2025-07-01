import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authFetch";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

// ✅ Get API base from environment
const API_BASE = import.meta.env.VITE_API_URL;

interface AnalyticsItem {
  _id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
}

const Dashboard = () => {
  const [topLinks, setTopLinks] = useState<AnalyticsItem[]>([]);
  const [totalUrls, setTotalUrls] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [limit, setLimit] = useState(5);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      if (limit) queryParams.append("limit", limit.toString());

      const res = await authFetch(`${API_BASE}/analytics?${queryParams.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Analytics fetch failed");
      if (!Array.isArray(data.topLinks)) throw new Error("Invalid analytics format received");

      setTopLinks(data.topLinks);
      setTotalUrls(data.totalUrls);
      setTotalClicks(data.totalClicks);
    } catch (err) {
      toast({
        title: "Error fetching analytics",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await authFetch(`${API_BASE}/url/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to delete");

      toast({ title: "Deleted", description: "URL deleted successfully" });
      fetchAnalytics(); // 🔁 Refresh list
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [startDate, endDate, limit]);

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-slate-100 to-blue-50">
      <h1 className="text-3xl font-bold mb-8 text-center text-slate-800">
        📊 Analytics Dashboard
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Top N</label>
          <select
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="border rounded px-3 py-1"
          >
            {[5, 10, 20].map((n) => (
              <option key={n} value={n}>
                Top {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-gray-500 text-sm">Total URLs</p>
          <p className="text-3xl font-bold text-blue-600">{totalUrls}</p>
        </div>
        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-gray-500 text-sm">Total Clicks</p>
          <p className="text-3xl font-bold text-green-600">{totalClicks}</p>
        </div>
      </div>

      {/* Top Links */}
      <h2 className="text-xl font-semibold mb-4 text-slate-700">🔗 Top Links</h2>
      <div className="space-y-4">
        {topLinks.length === 0 ? (
          <p className="text-gray-500">No top links to display yet.</p>
        ) : (
          topLinks.map((item) => (
            <div
              key={item._id}
              className="bg-white p-5 rounded-xl shadow border hover:bg-slate-50 transition relative"
            >
              <p className="text-lg font-semibold text-blue-700 break-all">
                {item.originalUrl}
              </p>
              <p className="text-sm text-gray-600">
                Short:{" "}
                <a
                  href={`${API_BASE}/s/${item.shortCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono underline text-blue-500"
                >
                  {`${API_BASE}/s/${item.shortCode}`}
                </a>
              </p>
              <p className="text-sm text-gray-800">
                Clicks: <strong>{item.clicks}</strong>
              </p>
              <p className="text-sm text-gray-400">
                Created:{" "}
                {new Date(item.createdAt).toLocaleString("en-IN", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
              <Button
                variant="ghost"
                className="absolute top-3 right-3 text-red-500"
                onClick={() => handleDelete(item._id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
