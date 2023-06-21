import { SmartContract, useContract } from "@thirdweb-dev/react";
import { fundingAddress } from "../const/address";
import { BaseContract } from "ethers";

type useFundingContract = () => {
  contract: SmartContract<BaseContract> | undefined;
};

export const useFundingContract: useFundingContract = () => {
  const { contract } = useContract(fundingAddress);
  return { contract };
};
