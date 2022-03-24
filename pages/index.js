import React, { useEffect, useState } from 'react';
import newInstance from '../ethereum/factory';
import { Button, Card, Icon } from 'semantic-ui-react';
import Layout from '../components/Layout';
import 'semantic-ui-css/semantic.min.css';

const Home = ({ newData, arrayCampaigns }) => {
  const [campaigns, setCampaigns] = useState();
  const [contract, setContract] = useState();

  console.log(contract);
  const items = [];

  if (campaigns)
    campaigns.map((item) => {
      items.push({
        header: item,
        description: <a>View Campaign</a>,
        fluid: true,
      });
    });

  useEffect(() => {
    setContract(JSON.parse(newData));
    setCampaigns(arrayCampaigns);
  }, []);

  return (
    <Layout>
      <h2>Open Campaigns</h2>
      <Button icon labelPosition='right' floated='right'>
        Create Campaign
        <Icon name='add circle' />
      </Button>
      <Card.Group items={items} />
    </Layout>
  );
};

export async function getStaticProps() {
  const data = await newInstance();
  const newData = JSON.stringify(data);
  const arrayCampaigns = await data.methods.getDeployedCampaigns().call();
  // console.log('getStaticProps', arrayCampaigns);
  return {
    props: {
      newData,
      arrayCampaigns,
    },
  };
}

export default Home;
