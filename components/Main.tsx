import Card from "@/components/Card";

const Main = () => {
  return (
    <div className="max-w-screen-xl py-6 pb-20 px-4 mx-auto">
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
        </div>
    </div>
  )
}

export default Main