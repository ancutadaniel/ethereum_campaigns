import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Icon,
  Container,
  Grid,
  Divider,
} from 'semantic-ui-react';
import Layout from '../../components/Layout';

import { useRouter } from 'next/router';
import { Link } from '../../routes';

import getWeb3 from '../../ethereum/getWeb3';
import Campaign from '../../ethereum/build/Campaign.json';
import ContributeForm from '../../components/ContributeForm';

const ShowDetails = () => {
  const router = useRouter();
  const [web, setWeb] = useState();
  const [contract, setContract] = useState();
  const [address, setAddress] = useState();

  const [summary, setSummary] = useState();
  const [items, setItems] = useState();

  const handlerAddress = () => {
    const addressUrl = router.asPath.replace('/campaigns/', '');
    setAddress(addressUrl);
  };

  const createContractInstance = async () => {
    if (web) {
      const data = new web.eth.Contract(Campaign.abi, address);
      setContract(data);
    }
  };

  const handleSummary = async () => {
    if (contract) {
      const summaryData = await contract.methods.getSummary().call();

      if (summaryData) {
        const mapData = {
          minimumContribution: summaryData[0],
          balance: summaryData[1],
          numberOfContributors: summaryData[2],
          numRequests: summaryData[3],
          manager: summaryData[4],
        };

        const items = [
          {
            header: mapData.manager,
            meta: 'Address of manager',
            description:
              'The manager create this campaigns and can create request and withdraw money',
            style: { overflowWrap: 'break-word' },
          },
          {
            header: web.utils.fromWei(mapData.balance, 'ether'),
            meta: 'Campaign Balance (ETHER)',
            description:
              'The Balance is how much money this campaign has left to spend',
          },
          {
            header: mapData.minimumContribution,
            meta: 'Minimum Contribution (WEI)',
            description: `You must contribute at least ${mapData.minimumContribution} WEI`,
          },
          {
            header: mapData.numberOfContributors,
            meta: 'Number Of Contributors',
            description: `Number of people who already donate to this campaign`,
          },
          {
            header: mapData.numRequests,
            meta: 'Number Of Request',
            description: `A request tries to withdraw money from the contract.`,
          },
        ];

        setItems(items);
        setSummary(mapData);
      }
    }
  };

  const handlerReload = () => window.location.reload(true);

  const load = async () => {
    const web3 = await getWeb3();
    setWeb(web3);
  };

  useEffect(() => {
    load();
  }, []);

  //   console.log(address, web, contract, summary);

  return (
    <Layout>
      <Grid columns={12} style={{ marginBottom: '30px' }}>
        <Container textAlign='center'>
          <h3 style={{ paddingTop: '30px' }}>Execute the steps bellow</h3>
          <Button
            icon
            labelPosition='right'
            floated='left'
            onClick={handlerReload}
          >
            1. Reload Page
            <Icon name='add circle' />
          </Button>
          <Button
            icon
            labelPosition='right'
            floated='left'
            onClick={handlerAddress}
          >
            2. Set Contract Address
            <Icon name='add circle' />
          </Button>
          <Button
            icon
            labelPosition='right'
            floated='left'
            onClick={createContractInstance}
          >
            3. Set Contract Instance
            <Icon name='add circle' />
          </Button>
          <Button
            icon
            labelPosition='right'
            floated='left'
            onClick={handleSummary}
          >
            4. Summary Campaign
            <Icon name='add circle' />
          </Button>
        </Container>
      </Grid>
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column width={12}>
            <Card.Group items={items} />
            {address && (
              <div>
                <Divider horizontal>Or</Divider>
                <Link route={`/campaigns/${address}/requests`}>
                  <a>
                    <Button
                      icon
                      labelPosition='right'
                      floated='left'
                      inverted
                      color='violet'
                    >
                      View Request
                      <Icon name='list' />
                    </Button>
                  </a>
                </Link>
              </div>
            )}
          </Grid.Column>
          <Grid.Column width={4}>
            {summary && (
              <ContributeForm
                web3={web}
                address={address}
                contract={contract}
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export default ShowDetails;
