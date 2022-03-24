const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider('debug'));

const compiledFactory = require('./build/CampaignFactory.json');

// console.log(compiledFactory.abi);
// console.log(compiledFactory.evm.bytecode.object);

let accounts;
let factory;

const deployTest = async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: compiledFactory.evm.bytecode.object,
      arguments: [],
    })
    .send(
      { from: accounts[0], gas: 5000000, gasPrice: '30000000000' },
      (error, transactionHash) =>
        console.log('error', error, 'txhash', transactionHash)
    )
    .on('error', (error) => console.log(error))
    .on('transactionHash', (transactionHash) =>
      console.log('transactionHash', transactionHash)
    )
    .on('receipt', function (receipt) {
      console.log('receipt', receipt.contractAddress); // contains the new contract address
    })
    .on('confirmation', function (confirmationNumber, receipt) {
      console.log('confirmation', confirmationNumber, receipt);
    })
    .then(function (newContractInstance) {
      console.log('newContractInstance', newContractInstance.options.address);
    });
};

deployTest();
