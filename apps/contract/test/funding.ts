import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Funding", function () {
  let token: Contract;
  let funding: Contract;
  let differentTokenContract: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addr3: SignerWithAddress;
  //   let tokenAddress: string = "0x30A320dE335c2c62eE5485AA4F06b63438b82754";

  beforeEach(async function () {
    const ERC20Token = await ethers.getContractFactory("MyToken");
    token = await ERC20Token.deploy();
    [owner, addr1] = await ethers.getSigners();
    token.mint(addr1.address, 100);
    const tokenAddress = token.address;

    // // Create a different token contract
    // const differentToken = await ethers.getContractFactory("DifferentToken");
    // differentTokenContract = await differentToken.deploy();
    // await differentTokenContract.mint(addr1.address, 199);

    const FundingToken = await ethers.getContractFactory("Funding");
    funding = await FundingToken.deploy(tokenAddress);
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
  });

  it("should display the campagin count", async function () {
    const campaginCount = await funding.campaignCount();
    console.log("campaginCount: ", campaginCount);
    expect(campaginCount).to.equal(0);
  });
  it("should create a new campaign", async function () {
    const campaignTitle = "New Campaign";
    const campaignDescription = "Campaign Description";
    const campaignTarget = 100;
    const campaignImage = "image.png";

    // Create a new campaign
    await funding.createCampaing(
      campaignTitle,
      campaignDescription,
      campaignTarget,
      campaignImage
    );

    // Get the campaign details
    const campaign = await funding.getCampaign(0);

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

  it("should donate to a campaign", async function () {
    const campaignTitle = "New Campaign";
    const campaignDescription = "Campaign Description";
    const campaignTarget = 100;
    const campaignImage = "image.png";

    // Create a new campaign
    await funding.createCampaing(
      campaignTitle,
      campaignDescription,
      campaignTarget,
      campaignImage
    );

    // Get the campaign details
    const campaign = await funding.getCampaign(0);

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

    // Donate to the campaign
    await token.connect(addr1).approve(funding.address, campaignTarget);
    await funding.connect(addr1).donate(0, 20);

    await token.mint(addr2.address, 100);

    await token.connect(addr2).approve(funding.address, campaignTarget);
    await funding.connect(addr2).donate(0, 30);

    const balance = await token.balanceOf(funding.address);

    const adress1Balance = await token.balanceOf(addr1.address);
    const address2Balance = await token.balanceOf(addr2.address);

    expect(balance).to.equal(50);
    expect(adress1Balance).to.equal(80);
    expect(address2Balance).to.equal(70);
  });

  it("should not donate to a campaign if the deadline has passed", async function () {
    const campaignTitle = "New Campaign";
    const campaignDescription = "Campaign Description";
    const campaignTarget = 100;
    const campaignImage = "image.png";

    // Create a new campaign
    await funding.createCampaing(
      campaignTitle,
      campaignDescription,
      campaignTarget,
      campaignImage
    );

    // Get the campaign details
    const campaign = await funding.getCampaign(0);

    // Verify the campaign details
    expect(campaign.owner).to.equal(owner.address);
    expect(campaign.title).to.equal(campaignTitle);
    expect(campaign.description).to.equal(campaignDescription);
    expect(campaign.target).to.equal(campaignTarget);
    // expect(campaign.deadline).to.be.gt(0);
    expect(campaign.image).to.equal(campaignImage);
    expect(campaign.recievedAmount).to.equal(0);
    expect(campaign.donorAddresses.length).to.equal(0);
    expect(campaign.donationAmounts.length).to.equal(0);
    //setTimeOut for 30 days
    await ethers.provider.send("evm_increaseTime", [2592000]);
    await ethers.provider.send("evm_mine");

    // Try to donate to the campaign
    await token.connect(addr1).approve(funding.address, campaignTarget);
    await expect(funding.connect(addr1).donate(0, 20)).to.be.reverted;
  });

  it("should not donate to a campaign if the target has been reached", async function () {
    const campaignTitle = "New Campaign";
    const campaignDescription = "Campaign Description";
    const campaignTarget = 100;
    const campaignImage = "image.png";

    // Create a new campaign
    await funding.createCampaing(
      campaignTitle,
      campaignDescription,
      campaignTarget,
      campaignImage
    );

    // Get the campaign details
    const campaign = await funding.getCampaign(0);

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

    // Donate to the campaign
    await token.connect(addr1).approve(funding.address, campaignTarget);
    await funding.connect(addr1).donate(0, 90);
    await token.mint(addr2.address, 10);
    await token.connect(addr2).approve(funding.address, campaignTarget);
    await funding.connect(addr2).donate(0, 10);

    //setTimeOut for 30 days
    await ethers.provider.send("evm_increaseTime", [2596000]);
    await ethers.provider.send("evm_mine");

    // Try to donate to the campaign
    await token.connect(addr2).approve(funding.address, campaignTarget);
    await expect(funding.connect(addr2).donate(0, 20)).to.be.reverted;
  });

  it("should withdraw the funds ", async function () {
    const campaignTitle = "New Campaign";
    const campaignDescription = "Campaign Description";
    const campaignTarget = 100;
    const campaignImage = "image.png";

    // Create a new campaign
    await funding.createCampaing(
      campaignTitle,
      campaignDescription,
      campaignTarget,
      campaignImage
    );

    // Get the campaign details
    const campaign = await funding.getCampaign(0);

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

    // Donate to the campaign

    await token.connect(addr1).approve(funding.address, campaignTarget);
    await funding.connect(addr1).donate(0, 90);
    await token.mint(addr2.address, 10);
    await token.connect(addr2).approve(funding.address, campaignTarget);
    await funding.connect(addr2).donate(0, 10);

    //setTimeOut for 30 days
    await ethers.provider.send("evm_increaseTime", [2593000]);
    await ethers.provider.send("evm_mine");

    await funding.connect(owner).withdrawl(0);

    // Try to withdraw the funds
    await expect(await token.balanceOf(owner.address)).to.equal(100);
  });

  it("should not withdraw the funds if the deadline has not passed", async function () {
    const campaignTitle = "New Campaign";
    const campaignDescription = "Campaign Description";
    const campaignTarget = 100;
    const campaignImage = "image.png";

    // Create a new campaign
    await funding.createCampaing(
      campaignTitle,
      campaignDescription,
      campaignTarget,
      campaignImage
    );

    // Get the campaign details
    const campaign = await funding.getCampaign(0);

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

    // Donate to the campaign

    await token.connect(addr1).approve(funding.address, campaignTarget);
    await funding.connect(addr1).donate(0, 90);
    await token.mint(addr2.address, 10);
    await token.connect(addr2).approve(funding.address, campaignTarget);
    await funding.connect(addr2).donate(0, 10);

    // Try to withdraw the funds
    await expect(funding.connect(owner).withdrawl(0)).to.be.reverted;
  });

  it("should not withdraw the funds if not the owner", async function () {
    const campaignTitle = "New Campaign";
    const campaignDescription = "Campaign Description";
    const campaignTarget = 100;
    const campaignImage = "image.png";

    // Create a new campaign
    await funding.createCampaing(
      campaignTitle,
      campaignDescription,
      campaignTarget,
      campaignImage
    );

    // Get the campaign details
    const campaign = await funding.getCampaign(0);

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

    // Donate to the campaign

    await token.connect(addr1).approve(funding.address, campaignTarget);
    await funding.connect(addr1).donate(0, 90);
    await token.mint(addr2.address, 10);
    await token.connect(addr2).approve(funding.address, campaignTarget);
    await funding.connect(addr2).donate(0, 10);

    //setTimeOut for 30 days
    await ethers.provider.send("evm_increaseTime", [2592000]);
    await ethers.provider.send("evm_mine");


    // Try to withdraw the funds
    await expect(funding.connect(addr1).withdrawl(0)).to.be.reverted;
  });
});
