import Main from "@/components/Main";
import Card from "@/components/Card";
import Navbar from "@/components/Navbar/Navbar";
import HeaderSection from "@/components/Header-Section";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <div className="mt-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold uppercase">Clothes & Rates</h1>
          <p className="py-3">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui, veniam?
          </p>
        </div>
        <Main/>
      </div>
      <Footer/>
    </div>
  )
}