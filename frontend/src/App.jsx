import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from "motion/react";
import PageTransition from "./components/PageTransition";

import AppNavbar from "./components/Navbars";
import AppFooter from "./components/Footer";

import HomePage from "./pages/HomePage";
import AnalysisPage from "./pages/AnalysisPage";
import ProductFinderPage from "./pages/ProductFinderPage";
import ShopPage from "./pages/ShopPage";
import BlogPage from "./pages/BlogPage";
import CheckoutPage from "./pages/CheckoutPage";
import UserProfilePage from "./pages/UserProfilePage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import FAQPage from "./pages/FAQPage";
import ReviewsPage from "./pages/ReviewsPage";
import ScrollToTop from "./components/ScrollToTop";
import PaymentPage from "./pages/PaymentPage";
import AuthPage from "./pages/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />

      {/* ------- Navbar Section ------- */}
      <AppNavbar />

      {/* ------------ Define Routes -------------- */}
      <AnimatePresence mode="wait" onExitComplete={() => {
        document.activeElement?.blur?.();
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });}}>
        <main className="main-content">
        
          <Routes location={location} key={location.pathname}>
            {/* ------------ Home Page -------------- */}
            <Route
              path="/"
              element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              }
            />

            {/* -------- Product Finder Page --------- */}
            <Route
              path="/product-finder"
              element={
                <PageTransition>
                  <ProductFinderPage />
                </PageTransition>
              }
            />

            {/* -------------- Shop Page ------------- */}
            <Route
              path="/shop"
              element={
                <PageTransition>
                  <ShopPage />
                </PageTransition>
              }
            />

            {/* ----------- Analysis Page ------------ */}
            <Route
              path="/ai-analysis"
              element={
                <PageTransition>
                  <AnalysisPage />
                </PageTransition>
              }
            />

            {/* --- Shop Page on clicking Shop now button --- */}
            <Route
              path="/shop/:homeCategoryClicked"
              element={
                <PageTransition>
                  <ShopPage />
                </PageTransition>
              }
            />

            {/* -------------- Blog Page ------------- */}
            <Route
              path="/blog"
              element={
                <PageTransition>
                  <BlogPage />
                </PageTransition>
              }
            />

            {/* -------------- Checkout Page ------------- */}
            <Route
              path="/checkout"
              element={
                <PageTransition>
                  <CheckoutPage />
                </PageTransition>
              }
            />

            {/* -------------- Payment Page ------------- */}
            <Route
              path="/payment"
              element={
                <PageTransition>
                  <PaymentPage />
                </PageTransition>
              }
            />

            {/* -------------- User Profile Page ------------- */}
            <Route
              path="/user-profile"
              element={
                <PageTransition>
                  <UserProfilePage />
                </PageTransition>
              }
            />

            {/* -------------- Privacy Policy ------------- */}
            <Route
              path="/privacy-policy"
              element={
                <PageTransition>
                  <PrivacyPage />
                </PageTransition>
              }
            />

            {/* -------------- Terms and Conditions ------------- */}
            <Route
              path="/terms-and-conditions"
              element={
                <PageTransition>
                  <TermsPage />
                </PageTransition>
              }
            />

            {/* -------------- FAQs ------------- */}
            <Route
              path="/faqs"
              element={
                <PageTransition>
                  <FAQPage />
                </PageTransition>
              }
            />

            {/* -------------- Reviews ------------- */}
            <Route
              path="/reviews"
              element={
                <PageTransition>
                  <ReviewsPage />
                </PageTransition>
              }
            />
			<Route
			  path="/auth"
			  element={
				<PageTransition>
				  <AuthPage />
				</PageTransition>
			  }
			/>
		  <Route
			  path="/forgot-password"
			  element={
				<PageTransition>
				  <ForgotPasswordPage />
				</PageTransition>
			  }
			/>
			</Routes>
        </main>
      </AnimatePresence>
      

      {/* ----------- Footer ------------ */}
      <AppFooter />
    </>
  );
}

export default App;