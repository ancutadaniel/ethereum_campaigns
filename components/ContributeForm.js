import React, { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';

const ContributeForm = ({ address, web3, contract }) => {
  const [form, setForm] = useState({
    contribute: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlerForm = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage('');
    try {
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      await contract.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(form.contribute, 'ether'),
        gas: 5000000,
        gasPrice: '30000000000',
      });

      console.log(address, web3, contract);
      window.location.reload(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  const handlerInput = (e) => {
    setForm({ [e.target.name]: e.target.value });
  };

  return (
    <>
      <h2>Contribute to campaign</h2>
      <Form onSubmit={handlerForm} error={!!errorMessage}>
        <Form.Field>
          <label>Amount To Contribution</label>
          <Input
            label='ether'
            labelPosition='right'
            placeholder='Amount To Contribution'
            loading={loading}
            id='contribute'
            name='contribute'
            type='text'
            min='0'
            value={form.contribute}
            onChange={handlerInput}
          />
        </Form.Field>
        <Message
          error
          header='Oops! Something went wrong!'
          content={errorMessage}
        />

        <Button type='submit' primary loading={loading}>
          Contribute
        </Button>
      </Form>
    </>
  );
};

export default ContributeForm;
