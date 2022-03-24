import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from '../components/Header';

import 'semantic-ui-css/semantic.min.css';

const Layout = ({ children }) => {
  return (
    <Container style={{ paddingTop: '35px' }}>
      <Header />
      {children}
    </Container>
  );
};

export default Layout;
