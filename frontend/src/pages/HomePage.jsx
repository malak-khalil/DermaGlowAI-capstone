import AppAIAnalysis from "../components/AppAIAnalysis";
import AppProductFinder from "../components/AppProductFinder";
import AppShop from "../components/AppShop";
import AppWhyUs from "../components/WhyUs";
import AppSkincareBasics from "../components/SkincareBasics";
import GoToTop from "../components/GoToTop";
import ProductFinderPreview from "../components/ProductFinderPreview";
import RevealOnScroll from "../components/RevealOnScroll";

export default function HomePage() {
  return (
    <main className="page-with-fixed-navbar homepage">
      <section className="home-section home-hero-section">
        <AppAIAnalysis />
      </section>

      <section className="home-section home-shop-preview-section">
        <AppShop />
      </section>

      <section className="home-section home-finder-preview-section">
        <ProductFinderPreview />
      </section>

      <section className="home-section home-basics-section">
        <AppSkincareBasics />
      </section>

      <section className="home-section home-whyus-section">
        <AppWhyUs />
      </section>

      <GoToTop />
    </main>
  );
}