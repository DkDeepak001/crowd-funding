import type { NextPage } from "next";
import Header from "../components/header";

const Home: NextPage = () => {
  return (
    <div className="bg-green-50 max-h-full min-h-screen">
      <Header />
    </div>
  );
};

export default Home;
