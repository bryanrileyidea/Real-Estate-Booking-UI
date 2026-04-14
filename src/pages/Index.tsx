import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import PlatformSection from "@/components/PlatformSection";
import PropertyTypes from "@/components/PropertyTypes";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <PlatformSection />
      <PropertyTypes />
      <Footer />
    </div>
  );
};

export default Index;
