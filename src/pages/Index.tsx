import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import BridalSection from "@/components/BridalSection";
import GalleryPreview from "@/components/GalleryPreview";
import WhyChooseUs from "@/components/WhyChooseUs";
import AppointmentForm from "@/components/AppointmentForm";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <AboutSection />
      <ServicesSection />
      <BridalSection />
      <GalleryPreview />
      <WhyChooseUs />
      <AppointmentForm />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
