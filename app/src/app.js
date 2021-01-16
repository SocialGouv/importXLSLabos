import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import * as Sentry from "@sentry/browser";
import styled from "styled-components";

import { setUser } from "./redux/auth/actions";

import Account from "./scenes/account";
import Auth from "./scenes/auth";
import Import from "./scenes/import";
import Users from "./scenes/user";
import Stats from "./scenes/stats";
import Batch from "./scenes/batch";

import Header from "./components/header";
import Drawer from "./components/drawer";

import api from "./services/api";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.less";

// if (process.env.NODE_ENV === "production") {
Sentry.init({ dsn: "XXX", environment: "app" });
// }

export default () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Auth.user);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get("/user/signin_token");
        if (!res.ok || !res.user) return setLoading(false);
        if (res.token) api.setToken(res.token);
        Sentry.configureScope((scope) => scope.setUser({ email: res.user.email }));
        dispatch(setUser(res.user));
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Wrapper>
      <Router>
        <div className="main">
          {user && <Header />}
          {user && <Drawer />}
          <RoutesWrapper style={{ marginLeft: user ? 160 : 0 }}>
            <Switch>
              <Route path="/auth" component={Auth} />
              <Route path="/stats" component={Stats} />
              <Route path="/batch" component={Batch} />
              <RestrictedRoute path="/account" component={Account} />
              <RestrictedRoute path="/user" component={Users} />
              <RestrictedRoute path="/" component={Import} />
            </Switch>
          </RoutesWrapper>
        </div>
      </Router>
    </Wrapper>
  );
};

const RestrictedRoute = ({ component: Component, isLoggedIn, ...rest }) => {
  const user = useSelector((state) => state.Auth.user);
  return <Route {...rest} render={(props) => (user ? <Component {...props} /> : <Redirect to={{ pathname: "/auth" }} />)} />;
};

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`;
const RoutesWrapper = styled.div`
  height: 100%;
  @media print {
    margin-left: 0 !important;
  }
`;
