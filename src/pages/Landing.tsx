import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-100 flex flex-col justify-center items-center text-center px-6">
      <h1 className="text-4xl font-bold text-slate-800 mb-6">
        Welcome to Lovable URL Shortener 💙
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-xl">
        Simplify and track your links in seconds. Login or sign up to get started.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate("/login")} className="bg-blue-600 text-white">
          Login
        </Button>
        <Button variant="outline" onClick={() => navigate("/signup")}>
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default Landing;
