import FAQs from "@/components/Home/FAQs"
import Hero from "@/components/Home/Hero"
import HowWeWork from "@/components/Home/HowWeWork"
import Services from "@/components/Home/Services"
import IndustrialSolutions from "@/components/Home/IndustrialSolutions"
import CoalTrading from "@/components/Home/CoalTrading"
import ContactCTA from "@/components/Home/ContactCTA"
import Testimonials from "@/components/Home/Testimonials"
import Footer from "@/components/Layout/Footer"
import Header from "@/components/Layout/Header"
import WhatsAppFloat from "@/components/Layout/WhatsAppFloat"
import { ChatbotWidget } from "@/chatbot"


function page() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <IndustrialSolutions />
        <CoalTrading />
        <Testimonials />
        <HowWeWork />
        <ContactCTA />
        <FAQs />
      </main>
      <Footer />
      <ChatbotWidget />
      <WhatsAppFloat />
    </div>
  )
}

export default page
