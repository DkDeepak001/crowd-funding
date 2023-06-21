import { SmartContract, useContract } from "@thirdweb-dev/react";
import { tokenAddress } from "../const/address";
import { BaseContract } from "ethers";

type useTokenContract = () => {
  contract: SmartContract<BaseContract> | undefined;
};

export const useTokenContract: useTokenContract = () => {
  const { contract } = useContract(tokenAddress);
  return { contract };
};
