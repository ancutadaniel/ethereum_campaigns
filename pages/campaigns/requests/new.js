import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, Input, Message } from 'semantic-ui-react';

import getWeb3 from '../../../ethereum/getWeb3';
import Campaign from '../../../ethereum/build/Campaign.json';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';

const NewRequest = () => {
  const [form, setForm] = useState({
    description: '',
    value: '',
    recipientAddress: '',
  });
  const [address, setAddress] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [web, setWeb] = useState();
  const [contract, setContract] = useState();
  const router = useRouter();

  const handlerForm = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage('');
    try {
      const accounts = await web.eth.getAccounts();
      console.log(address, contract);

      await contract.methods
        .createRequest(
          form.description,
          web.utils.toWei(form.value, 'ether'),
          form.recipientAddress
        )
        .send({ from: accounts[0], gas: 5000000, gasPrice: '30000000000' });

      router.push(`/campaigns/${address}/requests`);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  const handlerInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlerReload = () => window.location.reload(true);

  const load = async () => {
    const web3 = await getWeb3();
    setWeb(web3);
    if (web3) {
      console.log(address);
      const data = await new web3.eth.Contract(Campaign.abi, address);
      setContract(data);
    }
  };

  const handleAddressUrl = () => {
    const addressUrl = router.asPath
      .replace('/campaigns/', '')
      .replace('/requests/new', '');
    setAddress(addressUrl);
  };

  useEffect(() => {
    handleAddressUrl();
    load();
  }, [address]);

  return (
    <Layout>
      <Button inverted color='green' onClick={handlerReload}>
        1. Reload page
      </Button>

      <Link route={`/campaigns/${address}/requests`}>
        <a>
          <Button inverted color='purple'>
            Back
          </Button>
        </a>
      </Link>
      <h2>Create a new request</h2>
      <Form onSubmit={handlerForm} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            label='description'
            labelPosition='right'
            placeholder='Description'
            id='description'
            name='description'
            type='text'
            value={form.description}
            onChange={handlerInput}
          />
        </Form.Field>
        <Form.Field>
          <label>Amount in Ether</label>
          <Input
            label='Ether'
            labelPosition='right'
            placeholder='Value'
            id='value'
            name='value'
            type='number'
            value={form.value}
            onChange={handlerInput}
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            label='recipient address'
            labelPosition='right'
            placeholder='Recipient Address'
            id='recipientAddress'
            name='recipientAddress'
            type='text'
            value={form.recipientAddress}
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
  );
};

export default NewRequest;
