import React from "react";
import styled from "styled-components";
import User from "./user";

export default () => {
  return (
    <HeaderWrapper>
      <Header>
        <User />
      </Header>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  height: 70px;

  @media print {
    display: none;
  }
`;

const Header = styled.div`
  padding: 15px;
  background-color: #284fa2;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 1;
`;
