import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "@/lib/authFetch";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  totalUrls: number;
  totalClicks: number;
  topLinks: {
    _id: string;
    originalUrl: string;
    shortCode: string;
    clicks: number;
  }[];
}

// ✅ Get base API URL from environment
const API_BASE = import.meta.env.VITE_API_URL;

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await authFetch(`${API_BASE}/analytics`);
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Failed to fetch analytics");
        setData(result);
      } catch (err: any) {
        console.error("❌ Analytics fetch failed:", err.message);
        toast({
          title: "Error",
          description: err.message || "Failed to load analytics",
          variant: "destructive",
        });

        if (err.message.includes("login")) {
          navigate("/login");
        }

        setData({ totalUrls: 0, totalClicks: 0, topLinks: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [navigate, toast]);

  if (loading) return <p className="text-gray-500 text-sm">Loading analytics...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Analytics Overview</h2>
      <div className="flex gap-4">
        <div className="p-4 rounded-lg bg-gray-100 shadow">
          <h3 className="text-sm text-muted-foreground">Total Shortened</h3>
          <p className="text-xl font-bold">{data?.totalUrls ?? 0}</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-100 shadow">
          <h3 className="text-sm text-muted-foreground">Total Clicks</h3>
          <p className="text-xl font-bold">{data?.totalClicks ?? 0}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold">Top Links</h3>
      {Array.isArray(data?.topLinks) && data.topLinks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No links clicked yet.</p>
      ) : (
        <div className="space-y-3">
          {data?.topLinks?.map((link) => (
            <div key={link._id} className="border rounded-md p-3">
              <p><span className="font-medium">Original:</span> {link.originalUrl}</p>
              <p>
                <span className="font-medium">Short:</span>{" "}
                <a
                  href={`${API_BASE}/s/${link.shortCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {`${API_BASE}/s/${link.shortCode}`}
                </a>
              </p>
              <p><span className="font-medium">Clicks:</span> {link.clicks}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Analytics;
