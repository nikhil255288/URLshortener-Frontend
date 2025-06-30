
import { Link, Zap, Globe } from "lucide-react";

const Hero = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
          <Link className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Lovable
        </h1>
      </div>
      
      <p className="text-xl text-slate-600 mb-4 max-w-2xl mx-auto">
        Transform your long URLs into short, memorable links in seconds
      </p>
      
      <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-500" />
          Lightning Fast
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-blue-500" />
          Global CDN
        </div>
        <div className="flex items-center gap-2">
          <Link className="h-4 w-4 text-green-500" />
          Custom Links
        </div>
      </div>
    </div>
  );
};

export default Hero;
