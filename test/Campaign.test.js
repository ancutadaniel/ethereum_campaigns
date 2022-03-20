const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

// console.log(compiledFactory.abi);
// console.log(compiledFactory.evm.bytecode.object);

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: compiledFactory.evm.bytecode.object,
      arguments: [1, 3600, 100],
    })
    .send({ from: accounts[0], gas: 5000000, gasPrice: '30000000000' });

  // assign the first item of campaigns array
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  // create instance of the campaign - javaScript representation of the contract at campaignAddress
  // access contract that exist at this address
  // campaign will be the actual contract that we deal with
  campaign = new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe('CampaignFactory Contract', () => {
  it('deploys CampaignFactory & Campaign Contracts', () => {
    console.log('factory address :', factory.options.address);
    console.log('campaign address :', campaign.options.address);
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    console.log('manager', manager);
    assert.equal(manager, accounts[0]);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({ value: 10, from: accounts[1] });
    // access the mapping( !!! cannot retrieve entire mapping )
    const isContributor = await campaign.methods
      .participants(accounts[1])
      .call();
    // check if is true
    assert(isContributor);
  });

  it('require minimum contributing', async () => {
    try {
      await campaign.methods.contribute().send({ value: 1, from: accounts[1] });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it('allows a manager to create a request', async () => {
    const manager = await campaign.methods.manager().call();
    await campaign.methods
      .createRequest('First Request', 100, accounts[2])
      .send({
        from: manager,
        gas: 1000000,
      });
    const isRequest = await campaign.methods.requests(0).call();
    assert.equal(isRequest.description, 'First Request');
  });

  it('process request', async () => {
    const manager = await campaign.methods.manager().call();
    await campaign.methods
      .contribute()
      .send({ value: web3.utils.toWei('10', 'ether'), from: accounts[3] });

    await campaign.methods
      .createRequest(
        'First Request',
        web3.utils.toWei('5', 'ether'),
        accounts[4]
      )
      .send({
        from: manager,
        gas: 1000000,
      });

    // vote request - use send - modified blockchain
    await campaign.methods.approveRequest(0).send({
      from: accounts[3],
      gas: 1000000,
    });

    // finalized the request
    await campaign.methods.finalizeRequest(0).send({
      from: manager,
      gas: 1000000,
    });

    // get balance of the address that get money from request
    let balance = await web3.eth.getBalance(accounts[4]);
    balance = web3.utils.fromWei(balance, 'ether');
    // parseFloat take string and convert to number
    balance = parseFloat(balance);
    console.log('balance', balance);
    assert(balance > 103);
  });
});
