// scripts/upgrade-leven-token-script.js
const { ethers, upgrades } = require('hardhat');

async function main () {
  const LevenTokenV2 = await ethers.getContractFactory('LevenTokenV2');
  console.log('Upgrading LevenToken...');
  const levenToken=await upgrades.upgradeProxy('0xA415e9E13820cb373E40B6994D8a10E97356F917', LevenTokenV2);
  console.log('LevenToken upgraded',levenToken.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });