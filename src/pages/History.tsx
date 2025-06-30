import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authFetch";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";

interface UrlEntry {
  id: string;
  original: string;
  short: string;
  clicks: number;
  created: string;
}

const History = () => {
  const [recentUrls, setRecentUrls] = useState<UrlEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await authFetch("http://localhost:5000/history");
        const data = await res.json();

        if (!Array.isArray(data)) throw new Error("Invalid response format");

        const formatted = data.map((item) => ({
          id: item._id,
          original: item.originalUrl,
          short: `http://localhost:5000/s/${item.shortCode}`,
          clicks: item.clicks ?? 0,
          created: new Date(item.createdAt).toLocaleString("en-IN", {
            dateStyle: "short",
            timeStyle: "short",
          }),
        }));

        setRecentUrls(formatted);
      } catch (err) {
        toast({
          title: "History Fetch Failed",
          description: err instanceof Error ? err.message : "Unexpected error",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [toast]);

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Copied!", description: url });
    } catch {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await authFetch(`http://localhost:5000/url/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Delete failed");

      setRecentUrls((prev) => prev.filter((url) => url.id !== id));
      toast({ title: "Deleted", description: "URL deleted successfully." });
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-slate-100 to-purple-50">
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">
        🕘 URL History
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading your history...</p>
      ) : recentUrls.length === 0 ? (
        <p className="text-center text-gray-400">You haven’t shortened any URLs yet.</p>
      ) : (
        <div className="space-y-4">
          {recentUrls.map((url) => (
            <div
              key={url.id}
              className="bg-white p-5 rounded-xl shadow border hover:bg-slate-50 transition"
            >
              <p className="text-lg font-semibold break-words text-blue-700">
                {url.original}
              </p>

              <div className="flex items-center justify-between mt-2">
                <a
                  href={url.short}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 underline font-mono"
                >
                  {url.short}
                </a>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(url.short)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(url.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-1">
                Clicks: <strong>{url.clicks}</strong>
              </p>
              <p className="text-xs text-gray-400">Created: {url.created}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
