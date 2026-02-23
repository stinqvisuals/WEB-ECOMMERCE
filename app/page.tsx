import Main from "@/components/Main";
import Card from "@/components/Card";
import HeaderSection from "@/components/Header-Section";
import Hero from "@/components/Hero";


export default function Home() {
  return (
    <div>
      <Hero />

      <section className="mt-16 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase">
            Clothes & Rates
          </h1>

          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui, veniam?
          </p>
        </div>

        <Main />

      </section>
    </div>
  );
}