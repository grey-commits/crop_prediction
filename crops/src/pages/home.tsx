import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";
import { Card } from "../components/ui/card";

export function Home() {
  const features = [
    {
      title: "Accurate Analysis",
      description: "Get precise soil composition data using advanced testing methods",
      icon: "📊",
    },
    {
      title: "Crop Recommendations",
      description: "Receive tailored crop suggestions based on your soil profile",
      icon: "🌾",
    },
    {
      title: "Historical Tracking",
      description: "Monitor soil health changes over time with detailed records",
      icon: "📈",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="rounded-full bg-primary/10 p-4">
          <Sprout className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Predict-O-Crop
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Make informed decisions about your crops with our advanced soil analysis tools.
          Get detailed insights and recommendations based on your soil composition.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg" className="h-12 px-8">
            <Link to="/soil-sampling">Start Soil Sampling</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8">
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="p-6 text-center">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>

      {/* Trusted By Section */}
      <div className="bg-muted rounded-lg p-8 text-center space-y-8">
        <h2 className="text-2xl font-bold">Trusted by Farmers Worldwide</h2>
        <p className="text-muted-foreground">
          Join thousands of farmers who make better farming decisions with our soil analysis system
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {(i + 1) * 1000}+
              </div>
              <div className="text-sm text-muted-foreground">
                {i === 0 ? "Soil Samples" : i === 1 ? "Active Users" : i === 2 ? "Crop Varieties" : "Success Stories"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Weather Widget (Placeholder) */}
      <div className="bg-primary/10 rounded-lg p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">Live Weather Update</h2>
        <p className="text-muted-foreground">Current weather based on your location will appear here.</p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="text-5xl">☀️</div>
          <div>
            <div className="text-lg font-semibold">28°C</div>
            <div className="text-sm text-muted-foreground">Sunny</div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="rounded-lg p-8 text-center border space-y-8">
        <h2 className="text-2xl font-bold">Recent Achievements</h2>
        <p className="text-muted-foreground">
          Celebrating milestones in helping farmers worldwide
        </p>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="text-3xl mb-2">🏅</div>
            <h3 className="font-semibold mb-1">5000+ Samples Processed</h3>
            <p className="text-sm text-muted-foreground">Achieved in the last month</p>
          </Card>
          <Card className="p-4">
            <div className="text-3xl mb-2">👩‍🌾</div>
            <h3 className="font-semibold mb-1">New Farmers Joined</h3>
            <p className="text-sm text-muted-foreground">120+ new users this week</p>
          </Card>
          <Card className="p-4">
            <div className="text-3xl mb-2">🌱</div>
            <h3 className="font-semibold mb-1">Sustainable Farming</h3>
            <p className="text-sm text-muted-foreground">200+ crops optimized this month</p>
          </Card>
          <Card className="p-4">
            <div className="text-3xl mb-2">🌍</div>
            <h3 className="font-semibold mb-1">Global Reach</h3>
            <p className="text-sm text-muted-foreground">50+ countries served</p>
          </Card>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-muted rounded-lg p-8 text-center space-y-8">
        <h2 className="text-2xl font-bold">What Farmers Are Saying</h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <p className="text-muted-foreground mb-4">"Predict-O-Crop has transformed the way I manage my farm. The recommendations are spot on!"</p>
            <div className="font-semibold">- Ramesh, India 🇮🇳</div>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground mb-4">"I was able to increase my yield by 30% after using the soil analysis reports."</p>
            <div className="font-semibold">- Maria, Brazil 🇧🇷</div>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground mb-4">"Super easy to use and very helpful for small farmers like me."</p>
            <div className="font-semibold">- Ahmed, Egypt 🇪🇬</div>
          </Card>
        </div>
      </div>
    </div>
  );
}