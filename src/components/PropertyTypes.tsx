import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Token {
  name: string;
  symbol: string;
  price: string;
  description: string;
  logo: string;
}

const tokens: Token[] = [
  {
    name: "Houses",
    symbol: "House",
    price: "From $250k",
    description: "Single-family homes, townhouses, and villas. Browse by beds, baths, and neighborhood. Save favorites and send inquiries to listing agents.",
    logo: "H",
  },
  {
    name: "Apartments",
    symbol: "Apt",
    price: "From $120k",
    description: "Condos and apartments in urban and suburban areas. Filter by price, square footage, and amenities. Connect with agents for viewings.",
    logo: "A",
  },
  {
    name: "Land",
    symbol: "Land",
    price: "From $50k",
    description: "Residential and commercial land plots. Ideal for building your dream home or investment. Transparent listings with clear zoning info.",
    logo: "L",
  },
];

const PropertyTypes = () => {
  return (
    <section className="py-24 relative bg-gradient-to-br from-white via-slate-50 to-white" id="tokens">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
            Property <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Types</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {tokens.map((token, index) => (
            <Card
              key={index}
              className="bg-white border border-slate-200 p-8 hover:scale-105 hover:border-blue-400/50 transition-all duration-300 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-2xl">{token.logo}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{token.name}</h3>
                  <div className="text-lg font-semibold text-muted-foreground">{token.symbol}</div>
                </div>
              </div>

              <div className="text-3xl font-bold text-foreground mb-6">{token.price}</div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6 min-h-[80px]">
                {token.description}
              </p>

              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold"
                  onClick={() => window.location.href = "/listings"}
                >
                  Browse
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-slate-300 text-foreground hover:bg-slate-100 rounded-xl font-semibold"
                  onClick={() => toast.info(`Learn more about ${token.symbol}`)}
                >
                  Read More
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyTypes;
