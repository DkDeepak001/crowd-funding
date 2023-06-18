import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Funding", function () {
  let token: Contract;
  let funding: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  //   let tokenAddress: string = "0x30A320dE335c2c62eE5485AA4F06b63438b82754";

  beforeEach(async function () {
    const ERC20Token = await ethers.getContractFactory("MyToken");
    token = await ERC20Token.deploy();
    [owner, addr1] = await ethers.getSigners();
    token.mint(addr1.address, ethers.utils.parseEther("1000"));
    const tokenAddress = token.address;

    const FundingToken = await ethers.getContractFactory("Funding");
    funding = await FundingToken.deploy(tokenAddress);
    [owner, addr1] = await ethers.getSigners();
  });

  it("should display the campagin count", async function () {
    const campaginCount = await funding.campaignCount();
    console.log("campaginCount: ", campaginCount);
    expect(campaginCount).to.equal(0);
  });
  it("should create a new campaign", async function () {
    const campaignTitle = "New Campaign";
    const campaignDescription = "Campaign Description";
    const campaignTarget = ethers.utils.parseEther("1");
    const campaignImage = "image.png";

    // Create a new campaign
    await funding.createCampaing(
      campaignTitle,
      campaignDescription,
      campaignTarget,
      campaignImage
    );

    // Get the campaign details
    const campaign = await funding.getCampaing(0);

    // Verify the campaign details
    expect(campaign.owner).to.equal(owner.address);
    expect(campaign.title).to.equal(campaignTitle);
    expect(campaign.description).to.equal(campaignDescription);
    expect(campaign.target).to.equal(campaignTarget);
    expect(campaign.deadline).to.be.gt(0);
    expect(campaign.image).to.equal(campaignImage);
    expect(campaign.recievedAmount).to.equal(0);
    expect(campaign.donorAddresses.length).to.equal(0);
    expect(campaign.donationAmounts.length).to.equal(0);
  });
});
