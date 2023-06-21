import { useContractRead } from "@thirdweb-dev/react";
import { useFundingContract } from "../hooks/useFundingContract";

type CardProps = {
  campaingId: number;
};

const Card = ({ campaingId }: CardProps) => {
  const { contract: fundingContract } = useFundingContract();

  const { data: campaign, isLoading: isCampaignLoading } = useContractRead(
    fundingContract,
    "getCampaign",
    [campaingId - 1]
  );

  if (isCampaignLoading) return <div>Loading...</div>;

  return <div className="w-1/5 h-52 bg-red-500">{campaign.title}</div>;
};

export default Card;
