import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AccountSidebar from '../components/AccountSidebar';


import styled from 'styled-components';

const MyAccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-start;
  align-items: flex-start;
  padding-top: 30px;
`;

const ContentContainer = styled.div`
  margin-left: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const MyAccount = () => {
  return (
    <MyAccountContainer>
      <MainContent>
        <AccountSidebar />
        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </MainContent>
    </MyAccountContainer>
  );
};

export default MyAccount;
