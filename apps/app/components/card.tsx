import { Address, useContractRead } from "@thirdweb-dev/react";
import { useFundingContract } from "../hooks/useFundingContract";
import { BigNumber } from "ethers";
import { type } from "os";
import { format } from "date-fns";
import { Progress } from "semantic-ui-react";

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
  console.log(campaign);

  function convertUnixTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const formattedDate = format(date, "yyyy-MM-dd HH:mm:ss");
    return formattedDate;
  }
  if (!campaign) return <div>Loading...</div>;

  const percentage =
    (Number(campaign.recievedAmount.toString()) /
      Number(campaign.target.toString())) *
    100;
  if (isCampaignLoading) return <div>Loading...</div>;

  return (
    <div className="w-1/5  bg-brand-tertiary rounded-xl">
      <div className="w-full p-3 h-80 overflow-hidden rounded-xl">
        <img
          src={campaign.image}
          alt="campaign"
          className="h-full w-full object-cover rounded-xl"
        />
      </div>
      <div className="w-full flex flex-col p-3 pb-5">
        <div className="flex flex-row justify-between items-center pb-3 ">
          <div className="text-white text-xl font-bold ">{campaign.title}</div>

          <div className="text-white text-xl font-bold ">
            {convertUnixTimestamp(Number(BigNumber.from(campaign.deadline)))}
          </div>
        </div>

        <Progress percent={0} size="small" success>
          <div className="absolute right-0 text-white">
            {Number(campaign.recievedAmount.toString())} /
            {Number(campaign.target.toString())}
          </div>
          <div className="mt-2 text-white">Received Funds</div>
        </Progress>
        <button className="bg-brand-primary text-white rounded-xl mt-5 p-2 font-extrabold py-3">
          Donate
        </button>
      </div>
    </div>
  );
};

export default Card;
