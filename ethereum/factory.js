import getWeb3 from './getWeb3';
import CampaignFactory from './build/CampaignFactory.json';

const newInstance = async () => {
  const web3 = await getWeb3();
  // console.log(web3);
  return new web3.eth.Contract(
    CampaignFactory.abi,
    `0x7b3ED56e46f8f0104EDf8F1a718f1C24864E8B8C`
  );
};

export default newInstance;
