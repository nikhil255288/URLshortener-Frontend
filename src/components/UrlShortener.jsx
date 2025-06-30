import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Copy } from 'lucide-react';

export default function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    if (!originalUrl.trim()) return;
    setLoading(true);
    setCopied(false);
    try {
      const res = await axios.post('http://localhost:5000/shorten', { originalUrl });
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      console.error('Shorten error:', err);
      alert('Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-xl p-6 shadow-xl">
        <CardContent className="space-y-4">
          <h1 className="text-2xl font-semibold text-center">🔗 Lovable URL Shortener</h1>
          <Input
            type="url"
            placeholder="Enter your long URL here..."
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
          />
          <Button onClick={handleShorten} disabled={loading} className="w-full">
            {loading ? 'Shortening...' : 'Shorten URL'}
          </Button>
          {shortUrl && (
            <div className="flex items-center justify-between p-3 bg-gray-100 rounded-xl">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {shortUrl}
              </a>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4 text-gray-700" />
              </Button>
              {copied && <span className="text-sm text-green-600 ml-2">Copied!</span>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
