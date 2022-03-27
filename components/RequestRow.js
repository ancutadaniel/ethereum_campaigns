import React, { useState } from 'react';
import { TableRow, TableCell, Button } from 'semantic-ui-react';

const RequestRow = ({
  id,
  item,
  address,
  web,
  numberOfContributors,
  contract,
  summary,
}) => {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const accounts = await web.eth.getAccounts();
      await contract.methods.approveRequest(id).send({
        from: accounts[0],
        gas: 5000000,
        gasPrice: '30000000000',
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleFinalize = async () => {
    setLoading(true);
    try {
      const accounts = await web.eth.getAccounts();
      await contract.methods.finalizeRequest(id).send({
        from: accounts[0],
        gas: 5000000,
        gasPrice: '30000000000',
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const readyToFinalize = item.numberOfVoters > numberOfContributors / 2;

  return (
    <TableRow
      disabled={summary.complete}
      positive={readyToFinalize && !summary.complete}
    >
      <TableCell>{id}</TableCell>
      <TableCell>{item.description}</TableCell>
      <TableCell>{web.utils.fromWei(item.value)}</TableCell>
      <TableCell>{item.recipient}</TableCell>
      <TableCell>{`${+item.numberOfVoters}/${numberOfContributors}`}</TableCell>
      <TableCell>
        {!summary.complete && (
          <Button
            inverted
            color='purple'
            onClick={handleApprove}
            loading={loading}
          >
            Approve
          </Button>
        )}
      </TableCell>
      <TableCell>
        {!summary.complete && (
          <Button
            inverted
            color='blue'
            onClick={handleFinalize}
            loading={loading}
          >
            Finalize
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default RequestRow;
