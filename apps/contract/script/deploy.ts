import { ethers } from "hardhat";
import { promises as fs } from "fs";
import { Contract } from "ethers";

async function main() {
  const Token = await ethers.getContractFactory("MyToken");
  const token = await Token.deploy();

  await token.deployed();
  await deploymentInfo(token, "token.json");
}

async function deploymentInfo(contract: Contract, fileName: string) {
  const data = {
    contract: {
      address: contract.address,
      abi: contract.interface.format(),
      // @ts-ignore
      signerAddress: contract.signer.address,
    },
  };
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(fileName, content);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
