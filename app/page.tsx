import Main from "@/components/Main";
import Card from "@/components/Card";
import HeaderSection from "@/components/Header-Section";
import Hero from "@/components/Hero";


export default function Home() {
  return (
    <div>
      <Hero />
      <div className="mt-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold uppercase">Clothes & Rates</h1>
          <p className="py-3">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui, veniam?
          </p>
        </div>
        <Main />
      </div>
    </div>
  )
}