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
    <main className="page-with-fixed-navbar">
      <RevealOnScroll>
        <section>
          <AppAIAnalysis />
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={100}>
        <section>
          <AppShop />
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={200}>
        <section>
          <ProductFinderPreview />
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={300}>
        <section>
          <AppSkincareBasics />
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={400}>
        <section>
          <AppWhyUs />
        </section>
      </RevealOnScroll>

      <GoToTop />
    </main>
  );
}