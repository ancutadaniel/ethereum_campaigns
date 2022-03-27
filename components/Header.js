import React, { useState } from 'react';
import { Menu, Button, Icon } from 'semantic-ui-react';
import { ActiveItem } from './types';
import { Link } from '../routes';

const Header = ({ children }) => {
  return (
    <>
      <Menu>
        <Link route='/'>
          <a className='item'>Blockchain Campaign</a>
        </Link>

        <Menu.Menu position='right'>
          <Link route='/'>
            <a className='item'>Campaigns</a>
          </Link>
          <Link route='/campaigns/new'>
            <a className='item'>
              <Icon name='add' />
              Add
            </a>
          </Link>
        </Menu.Menu>
      </Menu>
    </>
  );
};

export default Header;
