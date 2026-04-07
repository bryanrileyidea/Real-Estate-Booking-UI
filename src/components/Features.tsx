import { Card } from "@/components/ui/card";
import { DollarSign, ArrowUpDown, Coins, Eye, CheckCircle2, ArrowUp, ArrowDown } from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "LOW FEES",
    description: "Transparent pricing with no hidden costs. Our platform keeps listing and inquiry fees minimal so you can focus on finding the right property.",
    iconElements: [ArrowUp, ArrowDown],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Coins,
    title: "MULTIPLE PROPERTY TYPES",
    description: "Homes, apartments, land, and commercial. Filter by type, price, beds, baths, and location to find exactly what you need.",
    iconElements: [ArrowUp, ArrowDown],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Eye,
    title: "TRANSPARENT PROCESS",
    description: "Clear listing details, verified agents, and a straightforward inquiry flow. Know who you're dealing with and what you're getting.",
    iconElements: [CheckCircle2],
    color: "from-blue-500 to-cyan-500"
  }
];

const Features = () => {
  return (
    <section className="py-24 relative bg-gradient-to-br from-white via-slate-50 to-white" id="features">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="bg-white border border-slate-200 p-8 hover:scale-105 hover:border-blue-400/50 transition-all duration-300 group shadow-sm"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg relative`}>
                  <feature.icon className="h-10 w-10 text-white z-10" />
                  {feature.iconElements && feature.iconElements.length > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {feature.iconElements.map((Icon, i) => (
                        <Icon 
                          key={i} 
                          className={`h-4 w-4 text-white/80 absolute ${
                            i === 0 ? 'top-2' : 'bottom-2'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">{feature.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
