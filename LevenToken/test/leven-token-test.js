
const { BN } = require('@openzeppelin/test-helpers');
const chai = require("chai");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const { solidity } = require("ethereum-waffle");
chai.use(solidity);
chai.use(require('chai-bn')(BN));

let LevenToken;
let levenToken;
let owner;
let addr1;
let addr2;

const ERC20Mock = artifacts.require('ERC20Mock');

beforeEach(async () => {
  [owner, addr1, addr2] = await ethers.getSigners();

  LevenToken = await ethers.getContractFactory("LevenToken");
  levenToken = await upgrades.deployProxy(LevenToken, owner, { initializer: 'initialize' });
  await levenToken.deployed();
})

describe("LevenToken", function () {
  describe("Appearance", function () {
    it("Should be named properly", async function () {
      expect(await levenToken.name()).to.equal("Leven Token");
    });

    it("Should have the correct symbol", async function () {
      expect(await levenToken.symbol()).to.equal("LEVEN");
    });

    it('Should have 18 decimals', async function () {
      expect(await levenToken.decimals()).to.equal(18);
    });

    it('Should have 0 total supply upon creation', async function () {
       expect(await levenToken.totalSupply()).to.equal('0');
    });

    it('All supply should be in the owner address', async function () {
      const ownerBalance = await levenToken.balanceOf(owner.address);
      expect(await levenToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe('Validation for locked amount', function () {
    it('After minting, the contract balance should be updated', async function () {
      await levenToken.mintToken(levenToken.address, 1000000000);
      expect(await levenToken.balanceOf(levenToken.address)).to.equal(1000000000);
      
    });
    it('After minting, there should be a total of 150 million tokens locked in three different pools', async function () {
      expect(await levenToken.getRequiredLockedBalance()/10**18).to.equal(150000000);
    });
  })

  describe('Ability to recover ERC20 tokens lost to our contract address', function () {
    const amount = new BN('100');

    const name = 'TEST';
    const symbol = 'TEST';

    let anotherERC20;
    beforeEach(async function () {
      anotherERC20 = await ERC20Mock.new(name, symbol, levenToken.address, amount);
    });

    it('Owner should be able to recover third party ERC20 tokens', async function () {
      expect(await anotherERC20.balanceOf(levenToken.address)).to.be.bignumber.equal(amount);
      expect(await anotherERC20.balanceOf(owner.address)).to.be.bignumber.equal(new BN('0'));

      await levenToken.recoverERC20(anotherERC20.address, 100);

      expect(await anotherERC20.balanceOf(levenToken.address)).to.be.bignumber.equal(new BN('0'));
      expect(await anotherERC20.balanceOf(owner.address)).to.be.bignumber.equal(amount);
    });

    it('Only owner can use this functionality', async function () {
      const recoverTx = levenToken.connect(addr1).recoverERC20(anotherERC20.address, 100);
      expect(recoverTx).to.be.revertedWith("Ownable: caller is not the owner")
    });
  });

  describe('Upgradeability', function () {
    it('Should be able to be upgraded', async function () {
      const LevenTokenV2 = await ethers.getContractFactory("LevenTokenV3");
      const levenTokenV2 = await upgrades.upgradeProxy(levenToken.address, LevenTokenV2);
      await levenTokenV2.initializeV3();

      expect(await levenTokenV2.banana()).to.be.equal(10);
    });
  })
});
