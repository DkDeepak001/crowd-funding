import Image from "next/image";
import SearchBar from "./searchBar";
import Link from "next/link";
import { ConnectWallet } from "@thirdweb-dev/react";

const Header = () => {
  return (
    <div className="w-screen h-32  items-center flex flex-row px-20 justify-between">
      <div className="flex flex-row items-center gap-x-5">
        <img
          src="/logo.png"
          alt="Logo"
          width={200}
          height={50}
          className="object-contain -mt-5"
        />
        <SearchBar />
      </div>
      <div className="flex flex-row items-center gap-x-14">
        <div className="flex flex-row items-center gap-x-7">
          <Link href="/myFunding" className="text-sm font-bold text-black">
            {" "}
            My Campaing{" "}
          </Link>
          <Link href="/createFunding" className="text-sm font-bold text-black">
            {" "}
            Create Campaing{" "}
          </Link>
        </div>
        <ConnectWallet
          style={{ backgroundColor: "black", color: "white", fontSize: 12 }}
        />
      </div>
    </div>
  );
};

export default Header;
