import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Icon,
  Container,
  Grid,
  Divider,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
} from 'semantic-ui-react';
import { Link } from '../../../routes';
import { useRouter } from 'next/router';

import getWeb3 from '../../../ethereum/getWeb3';
import Campaign from '../../../ethereum/build/Campaign.json';

import Layout from '../../../components/Layout';
import RequestRow from '../../../components/RequestRow';

const RequestIndex = () => {
  const router = useRouter();
  const [web, setWeb] = useState();
  const [contract, setContract] = useState();
  const [address, setAddress] = useState();

  const [summary, setSummary] = useState();
  const [requests, setRequests] = useState();

  const handlerAddress = () => {
    const addressUrl = router.asPath
      .replace('/campaigns/', '')
      .replace('/requests', '');
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

        setSummary(mapData);
      }
    }
  };

  const handlerRequestList = async () => {
    const requestsResp = await Promise.all(
      Array(+summary.numRequests)
        .fill()
        .map((_item, index) => contract.methods.requests(index).call())
    );
    setRequests(requestsResp);

    console.log(
      'return array of number,of that length',
      Array(+summary.numRequests)
        .fill()
        .map((_el, i) => i)
    );
  };

  const handlerReload = () => window.location.reload(true);

  const renderRow = () => {
    if (requests)
      return requests.map((item, index) => {
        return (
          <RequestRow
            id={index}
            item={item}
            key={index}
            address={address}
            web={web}
            numberOfContributors={summary.numberOfContributors}
            contract={contract}
            summary={summary}
          />
        );
      });
  };

  const load = async () => {
    const web3 = await getWeb3();
    setWeb(web3);
  };

  useEffect(() => {
    load();
  }, []);

  console.log(address, contract, summary, requests);

  return (
    <Layout>
      <Grid columns={12} style={{ marginBottom: '30px' }}>
        <Container textAlign='center'>
          <h2>Request List</h2>
          <Grid columns={12} style={{ marginBottom: '30px' }}>
            <Container textAlign='center'>
              <h3 style={{ paddingTop: '30px' }}>Execute the steps bellow</h3>
              <Button
                icon
                labelPosition='right'
                floated='left'
                onClick={handlerAddress}
              >
                1. Set Contract Address
                <Icon name='add circle' />
              </Button>
              <Button
                icon
                labelPosition='right'
                floated='left'
                onClick={createContractInstance}
              >
                2. Set Contract Instance
                <Icon name='add circle' />
              </Button>
              <Button
                icon
                labelPosition='right'
                floated='left'
                onClick={handleSummary}
              >
                3. Summary Campaign
                <Icon name='add circle' />
              </Button>
              <Button
                icon
                labelPosition='right'
                floated='left'
                onClick={handlerRequestList}
              >
                4. Request List
                <Icon name='add circle' />
              </Button>
            </Container>
          </Grid>
        </Container>
        <Container>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Description</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Recipient</TableHeaderCell>
                <TableHeaderCell>Number Of Voters</TableHeaderCell>
                <TableHeaderCell>Approve</TableHeaderCell>
                <TableHeaderCell>Complete</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>{renderRow()}</TableBody>
          </Table>
        </Container>
        {/* <Message
          error
          header='Oops! Something went wrong!'
          content={errorMessage}
        /> */}
      </Grid>
      <Divider horizontal>Or</Divider>
      <Container>
        <Link route={`/campaigns/${address}/requests/new`}>
          <a>
            <Button primary style={{ marginBottom: 20 }}>
              Add Request
            </Button>
          </a>
        </Link>
      </Container>
      <Container>
        <div> Found {summary?.numRequests} request!</div>
      </Container>
    </Layout>
  );
};

export default RequestIndex;
