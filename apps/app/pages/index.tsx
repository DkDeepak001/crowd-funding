import type { NextPage } from "next";
import { useFundingContract } from "../hooks/useFundingContract";
import { useRouter } from "next/router";
import { useContractRead } from "@thirdweb-dev/react";
import Card from "../components/card";
import { Suspense } from "react";
import { BigNumber } from "ethers";

const Home: NextPage = () => {
  const router = useRouter();
  const { contract: fundingContract } = useFundingContract();
  const { data: campaignsCount, isLoading: isCamapaingCountLoading } =
    useContractRead(fundingContract, "campaignCount");

  if (isCamapaingCountLoading) return <div>Loading...</div>;

  const campaignsCounts = Array.from(
    { length: campaignsCount?.toString() ?? 0 },
    (_, index) => index + 1
  );
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-8 text-center">
        All Campaings
      </h1>
      <div className="flex flex-row flex-wrap gap-5 items-center justify-center">
        {campaignsCounts?.map((item) => (
          <Suspense fallback={<div>Loading...</div>} key={item}>
            <Card campaingId={item} />
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default Home;
