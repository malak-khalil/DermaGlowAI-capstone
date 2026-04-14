import AppAIAnalysis from "../components/AppAIAnalysis"
import AppProductFinder from "../components/AppProductFinder"
import AppShop from "../components/AppShop"
import AppWhyUs from "../components/WhyUs"
import AppSkincareBasics from "../components/SkincareBasics"
import GoToTop from '../components/GoToTop';
import ProductFinderPreview from "../components/ProductFinderPreview";

export default function HomePage(){
    return(
        <main className="page-with-fixed-navbar">
        <>
            {/* ------- AI Section ---------- */}
                <AppAIAnalysis />

            {/* ------- Shop Section -------- */}	
                <AppShop />

            {/* --- Product Finder Section --- */}						
               <ProductFinderPreview />

            {/* ------- Blog Section -------- */}						
                <AppSkincareBasics />

            {/* -------- Why Us Section -------*/}						
                <AppWhyUs />


                <GoToTop />	
        </>
        </main>
    )
}

