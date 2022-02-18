const hre = require("hardhat");

/**
 * This script is good for ERC20 and BEP20 variant
 */
async function main() {
  console.log("Deploying LevenToken...");
  const LevenToken = await ethers.getContractFactory("LevenToken");
  const levenToken = await upgrades.deployProxy(LevenToken, { initializer: 'initialize' });
  await levenToken.deployed();
  console.log("LevenToken Proxy deployed to:", levenToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
