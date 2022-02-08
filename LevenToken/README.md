# Leven Token

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
```

Keep in mind that the address the script wants is not the address of the proxy contract but the implementation

# Deployment instructions for Ethereum and Binance Smart Chain

# Deploy tokens & ERC20 balances
```shell
npx hardhat run scripts/deploy-leven-token-script.js --network <network_name>

# Etherscan/bscscan verification
```
Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network <network_name> DEPLOYED_CONTRACT_ADDRESS