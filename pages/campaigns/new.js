import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';

import getWeb3 from '../../ethereum/getWeb3';
import CampaignFactory from '../../ethereum/build/CampaignFactory.json';

import { Router } from '../../routes';

const NewCampaigns = () => {
  const [form, setForm] = useState({
    contribute: '',
    deadline: '',
    goal: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [web, setWeb] = useState();
  const [contract, setContract] = useState();

  const handlerForm = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage('');
    try {
      const accounts = await web.eth.getAccounts();
      console.log(accounts);

      await contract.methods
        .factoryCampaign(form.contribute, form.deadline, form.goal)
        .send({ from: accounts[0], gas: 5000000, gasPrice: '30000000000' });

      Router.push('/');
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  const handlerInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const load = async () => {
    const web3 = await getWeb3();
    setWeb(web3);
    if (web3) {
      const data = new web3.eth.Contract(
        CampaignFactory.abi,
        `0x7b3ED56e46f8f0104EDf8F1a718f1C24864E8B8C`
      );
      setContract(data);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // console.log(web, contract, errorMessage);
  return (
    <>
      <Layout>
        <h2>Create a campaign</h2>
        <Form onSubmit={handlerForm} error={!!errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label='wei'
              labelPosition='right'
              placeholder='Minimum Contribution'
              id='contribute'
              name='contribute'
              type='number'
              min='0'
              value={form.contribute}
              onChange={handlerInput}
            />
          </Form.Field>
          <Form.Field>
            <label>Deadline</label>
            <Input
              label='seconds'
              labelPosition='right'
              placeholder='Deadline'
              id='deadline'
              name='deadline'
              type='number'
              min='0'
              value={form.deadline}
              onChange={handlerInput}
            />
          </Form.Field>
          <Form.Field>
            <label>Goal</label>
            <Input
              label='goal'
              labelPosition='right'
              placeholder='Goal'
              id='goal'
              name='goal'
              type='number'
              min='0'
              value={form.goal}
              onChange={handlerInput}
            />
          </Form.Field>

          <Message
            error
            header='Oops! Something went wrong!'
            content={errorMessage}
          />

          <Button type='submit' primary loading={loading}>
            Create
          </Button>
        </Form>
      </Layout>
    </>
  );
};

export default NewCampaigns;
