import SearchBar from "./searchBar";
import Link from "next/link";
import { ConnectWallet } from "@thirdweb-dev/react";

const Header = () => {
  return (
    <div className="w-screen h-32  items-center flex flex-row px-20 justify-between">
      <div className="flex flex-row items-center gap-x-5">
        <Link href="/">
          <img
            src="/logo.png"
            alt="Logo"
            width={200}
            height={50}
            className="object-contain -mt-5"
          />
        </Link>
      </div>
      <div className="flex flex-row items-center gap-x-14">
        <div className="flex flex-row items-center gap-x-7">
          <Link href="/mintToken" className="text-sm font-bold text-black">
            {" "}
            Mint Token{" "}
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
