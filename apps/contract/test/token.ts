import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("ERC20Token", function () {
  let totalSupply = 1000;
  let token: Contract;
  let staking: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    const ERC20Token = await ethers.getContractFactory("MyToken");
    token = await ERC20Token.deploy();
    [owner, addr1] = await ethers.getSigners();
  });

  it("should have correct name, symbol, and total supply", async function () {
    token.mint(owner.address, ethers.utils.parseEther("1000"));
    expect(await token.name()).to.equal("FundingToken");
    expect(await token.symbol()).to.equal("DKCF");
    expect(await token.totalSupply()).to.equal(ethers.utils.parseEther("1000"));
  });

  it("should allocate initial supply to the owner", async function () {
    token.mint(owner.address, ethers.utils.parseEther("1000"));
    expect(await token.balanceOf(owner.address)).to.equal(
      ethers.utils.parseEther("1000")
    );
  });

  it("should transfer tokens between accounts", async function () {
    token.mint(owner.address, ethers.utils.parseEther("1000"));
    await token.transfer(addr1.address, ethers.utils.parseEther("100"));

    expect(await token.balanceOf(owner.address)).to.equal(
      ethers.utils.parseEther("900")
    );
    expect(await token.balanceOf(addr1.address)).to.equal(
      ethers.utils.parseEther("100")
    );
  });

  it("should revert transfer when sender has insufficient balance", async function () {
    token.mint(owner.address, ethers.utils.parseEther("1000"));
    await expect(
      token
        .connect(addr1)
        .transfer(owner.address, ethers.utils.parseEther("100"))
    ).to.be.reverted;
  });
});
