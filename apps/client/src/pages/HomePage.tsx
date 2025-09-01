import AppLayout from "@/components/layouts/AppLayout";
import { Features } from "@/components/FeatureSection";
import { Hero } from "@/components/HeroSection";
import { Cta } from "@/components/CtaSectio";

const Home = () => {

  return (
    <AppLayout>
      <Hero />
      <Features />
      <Cta />
    </AppLayout>
  );
};


export default Home;
