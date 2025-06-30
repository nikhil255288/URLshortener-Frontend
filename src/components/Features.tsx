
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Shield, Smartphone, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Track clicks, geographic data, and referrer information"
    },
    {
      icon: Shield,
      title: "Secure",
      description: "All links are secured with HTTPS and spam protection"
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Optimized for all devices and screen sizes"
    },
    {
      icon: Users,
      title: "Team Features",
      description: "Collaborate with your team and manage links together"
    }
  ];

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
        Why Choose Lovable?
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Features;
