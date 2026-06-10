export const dynamic = 'force-dynamic';

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ConferenceTeaser from "@/components/ConferenceTeaser";
import LiveSection from "@/components/LiveSection";
import Ministries from "@/components/Ministries";
import CavSection from "@/components/CavSection";
import Donate from "@/components/Donate";
import Footer from "@/components/Footer";
import Beliefs from "@/components/Beliefs";
import Events from "@/components/Events";
import Testimonials from "@/components/Testimonials";
import Location from "@/components/Location";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <ConferenceTeaser />
      <Beliefs />
      <LiveSection />
      <Ministries />
      <CavSection />
      <Events />
      <Testimonials />
      <Donate />
      <Location />
      <Footer />
    </main>
  );
}
