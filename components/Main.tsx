import Card from "@/components/Card";
import { getClothes } from "@/lib/data";
import { notFound } from "next/navigation";

const Main = async () => {
  const clothes = await getClothes();
  if (!clothes) return notFound();

  return (
    <div className="max-w-screen-xl py-6 pb-20 px-4 mx-auto">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {clothes.map((clothes) => (
          <Card clothes={clothes} key={clothes.id} />
        ))}
      </div>
    </div>
  )
}

export default Main