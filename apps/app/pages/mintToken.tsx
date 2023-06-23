import { NextPage } from "next";
import { useTokenContract } from "../hooks/useTokenContract";
import {
  useAddress,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { BigNumber } from "ethers";

const MyFunding: NextPage = () => {
  const { contract } = useTokenContract();
  const address = useAddress();
  const {
    data: tokenBal,
    error,
    isLoading,
  } = useContractRead(contract, "balanceOf", [address]);

  const { mutateAsync: mint, isLoading: isMinting } = useContractWrite(
    contract,
    "mint"
  );

  const handleMint = async () => {
    try {
      await mint({ args: [address, 2] });
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-4xl font-extrabold">Mint Token</h1>
      <div className="flex flex-col justify-center items-center border border-black/75 rounded-2xl p-5">
        <div className="text-brand-primary text-xl font-bold">
          Available Token
        </div>
        <div className="text-brand-primary text-xl font-bold">
          {BigNumber.from(tokenBal).toString()}
        </div>
      </div>
      <button
        className="bg-brand-primary text-white rounded-xl mt-5 px-5 font-extrabold py-3"
        onClick={handleMint}
        disabled={isMinting}
      >
        {isMinting ? "Minting..." : "Mint"}
      </button>
    </div>
  );
};

export default MyFunding;
