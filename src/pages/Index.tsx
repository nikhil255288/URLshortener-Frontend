import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link, Copy, CheckCircle, LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sections
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Analytics from "@/pages/Analytics";
import { useAuthStore } from "@/store/authStore";
import { parseJwt } from "@/utils/jwt";

const Index = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  // 🔐 Check token validity on load
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const payload = parseJwt(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (!payload?.exp || payload.exp < currentTime) {
      useAuthStore.getState().clearToken();
      navigate("/login");
    }
  }, [token, navigate]);

  const validateUrl = (url: string) => {
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!longUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      });
      return;
    }

    if (!validateUrl(longUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ originalUrl: longUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to shorten");

      setShortUrl(data.shortUrl);
      toast({
        title: "Success!",
        description: "Your URL has been shortened",
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Server Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Short URL copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Hero />

        <div className="max-w-2xl mx-auto mb-16">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="url-input" className="text-sm font-medium text-slate-700">
                    Enter your long URL
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="url-input"
                      type="text"
                      placeholder="https://example.com/very-long-url"
                      value={longUrl}
                      onChange={(e) => setLongUrl(e.target.value)}
                      className="pl-10 h-12 text-base border-slate-200 focus:border-blue-500 transition-colors"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !longUrl.trim()}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Shortening...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      Shorten URL
                    </div>
                  )}
                </Button>
              </form>

              {shortUrl && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 animate-in slide-in-from-bottom duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      Your shortened URL is ready!
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <div className="flex-1 font-mono text-blue-600 font-medium truncate">
                      {shortUrl}
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 hover:bg-blue-50"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Features />
        <Analytics />
      </div>
    </div>
  );
};

export default Index;
