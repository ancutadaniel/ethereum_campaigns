import React, { useState } from 'react';
import { Menu, Button, Icon } from 'semantic-ui-react';
import { ActiveItem } from './types';

const Header = ({ children }) => {
  const [activeItem, setActiveItem] = useState();
  const handleItemClick = (e, { name }) => {
    console.log(e, name);
    setActiveItem(name);
  };

  return (
    <>
      <Menu>
        <Menu.Item
          name='submit'
          active={activeItem === ActiveItem.SUBMIT}
          onClick={handleItemClick}
        >
          Blockchain Campaign
        </Menu.Item>

        <Menu.Menu position='right'>
          <Menu.Item
            name='campaigns'
            active={activeItem === ActiveItem.CAMPAIGNS}
            onClick={handleItemClick}
          >
            Campaigns
          </Menu.Item>
          <Menu.Item
            name='create'
            active={activeItem === ActiveItem.CREATE}
            onClick={handleItemClick}
          >
            <Icon name='add' />
            Add
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </>
  );
};

export default Header;
