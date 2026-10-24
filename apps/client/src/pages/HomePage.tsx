import AppLayout from "@/components/layouts/AppLayout";
import { Features, Workflow } from "@/components/FeatureSection";
import { Hero } from "@/components/HeroSection";
import { Cta } from "@/components/CtaSectio";

const Home = () => {
  return (
    <AppLayout>
      <Hero />
      <Features />
      <Workflow />
      <Cta />
    </AppLayout>
  );
};

export default Home;
