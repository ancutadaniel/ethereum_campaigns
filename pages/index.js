import React, { useEffect, useState } from 'react';
import newInstance from '../ethereum/factory';
import { Button, Card, Icon } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';
import 'semantic-ui-css/semantic.min.css';

const Home = ({ newData, arrayCampaigns }) => {
  const [campaigns, setCampaigns] = useState();

  // console.log(contract);
  const items = [];

  const NavigateTo = (item) => (
    <Link route={`/campaigns/${item}`}>
      <a className='item'>View Campaign</a>
    </Link>
  );

  if (campaigns)
    campaigns.map((item) => {
      items.push({
        header: item,
        description: NavigateTo(item),
        fluid: true,
      });
    });

  useEffect(() => {
    setCampaigns(arrayCampaigns);
  }, []);

  return (
    <Layout>
      <h2>Open Campaigns</h2>
      <Link route='/campaigns/new'>
        <a className='item'>
          <Button icon labelPosition='right' floated='right'>
            Create Campaign
            <Icon name='add circle' />
          </Button>
        </a>
      </Link>
      <Card.Group items={items} />
    </Layout>
  );
};

export async function getStaticProps() {
  const data = await newInstance();
  const newData = JSON.stringify(data);
  const arrayCampaigns = await data.methods.getDeployedCampaigns().call();
  return {
    props: {
      newData,
      arrayCampaigns,
    },
  };
}

export default Home;
