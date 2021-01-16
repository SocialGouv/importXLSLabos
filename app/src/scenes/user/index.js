import React from "react";
import { Switch, Route } from "react-router-dom";
import styled from "styled-components";
import { Container } from "reactstrap";
import User from "./list";
import UserView from "./view";

export default () => {
  return (
    <StyledContainer>
      <Switch>
        <Route path="/user/:id" component={UserView} />
        <Route path="/" component={User} />
      </Switch>
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)`
  padding: 40px 50px 0;
`;
