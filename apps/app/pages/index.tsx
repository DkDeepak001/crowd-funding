import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen w-screen flex flex-row items-center justify-center">
      <h1 className="text-red-500 text-center text-3xl font-bold">
        Hello tailwind
      </h1>
    </div>
  );
};

export default Home;
