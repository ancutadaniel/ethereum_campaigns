import getWeb3 from './getWeb3';
import CampaignFactory from './build/CampaignFactory.json';

const newInstance = async () => {
  const web3 = await getWeb3();
  console.log(web3);
  return new web3.eth.Contract(
    CampaignFactory.abi,
    `0xcA9e0228311fA7179deCa33e786D57f489f92c1b`
  );
};

export default newInstance;
