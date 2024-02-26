import './header.scss';

import React, { CSSProperties, FC, useState } from 'react';
import LoadingBar from 'react-redux-loading-bar';
import { useNavigate } from "react-router-dom"
import HeaderAdmin from './components/headerAdmin';
import HeaderCustomer from './components/headerCustomer';
import { Storage } from 'react-jhipster';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
}

const Header = (props: IHeaderProps) => {
  /* jhipster-needle-add-element-to-menu - JHipster will add new menu items here */

  return (
    <div id="app-header">

      <LoadingBar className="loading-bar" />

      {Storage.local.get("user") === "admin" ?
        <HeaderAdmin {...props} />
        :
        <HeaderCustomer isAuthenticated={props.isAuthenticated} />
      }
    </div>
  );
};

export default Header;
