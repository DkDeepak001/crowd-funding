import {
  Address,
  useAddress,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { useFundingContract } from "../hooks/useFundingContract";
import { BigNumber } from "ethers";
import { type } from "os";
import { format } from "date-fns";
import { Progress } from "semantic-ui-react";
import { useTokenContract } from "../hooks/useTokenContract";
import { fundingAddress } from "../const/address";
import { useState } from "react";

type CardProps = {
  campaingId: number;
};

const Card = ({ campaingId }: CardProps) => {
  const address = useAddress();
  const { contract: fundingContract } = useFundingContract();

  const [value, setValue] = useState<number>();
  const { data: campaign, isLoading: isCampaignLoading } = useContractRead(
    fundingContract,
    "getCampaign",
    [campaingId - 1]
  );

  const { mutateAsync: donate, isLoading: isDonating } = useContractWrite(
    fundingContract,
    "donate"
  );

  const { mutateAsync: withdraw, isLoading: isWithdrawing } = useContractWrite(
    fundingContract,
    "withdrawl"
  );
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

  const handleDonate = async () => {
    if (!value) return alert("Please enter a value");
    if (value < 0) return alert("Please enter a positive value");
    if (
      value >
      Number(campaign.target.toString()) -
        Number(campaign.recievedAmount.toString())
    )
      return alert("Please enter a value less than the remaining amount");
    try {
      if (campaign.owner === address) {
        alert("You can't donate to your own campaign");
      } else {
        await donate({ args: [campaingId - 1, value] });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleWithdraw = async () => {
    try {
      if (campaign.owner !== address) {
        alert("Only owner can withdraw");
      } else {
        await withdraw({ args: [campaingId - 1] });
      }
    } catch (error) {
      console.log(error);
    }
  };

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

        <Progress percent={percentage} size="small" success>
          <div className="absolute right-0 text-white">
            {Number(campaign.recievedAmount.toString())} /
            {Number(campaign.target.toString())}
          </div>
          <div className="mt-2 text-white">Received Funds</div>
        </Progress>
        <div className="flex flex-row items-center justify-between mt-5">
          {campaign.owner !== address && (
            <input
              type="number"
              className="w-1/2 rounded-xl p-3"
              placeholder="Enter token "
              onChange={(e) => setValue(Number(e.target.value))}
              value={value}
            />
          )}

          <button
            className="bg-brand-primary text-white rounded-xl w-2/5 p-2 font-extrabold py-3"
            onClick={campaign.owner === address ? handleWithdraw : handleDonate}
          >
            {campaign.owner === address
              ? isWithdrawing
                ? "withdrawing... "
                : "withdraw"
              : isDonating
              ? "Donating..."
              : "Donate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
