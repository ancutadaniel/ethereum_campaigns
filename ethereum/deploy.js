const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const ganache = require('ganache-cli');

const compiledFactory = require('../ethereum/build/CampaignFactory.json');

// console.log(compiledFactory.abi);

const provider = new HDWalletProvider();

// local provider - replace for test provider
// const ganacheProvider = ganache.provider();

const web3 = new Web3(provider);

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(compiledFactory.abi)
      .deploy({
        data: compiledFactory.evm.bytecode.object,
        arguments: [],
      })
      .send({ from: accounts[0], gas: 5000000, gasPrice: '30000000000' });

    console.log('contract ABI', compiledFactory.abi);
    console.log('Contract deployed to', result.options.address);

    provider.engine.stop();
  } catch (error) {
    console.error(error);
  }
};
deploy();
