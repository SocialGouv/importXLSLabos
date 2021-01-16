import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

export default () => {
  const user = useSelector((state) => state.Auth.user);
  if (!user) return <div />;
  return (
    <Sidebar>
      <Nav>
        <li>
          <NavLink exact to="/" activeClassName="active">
            Accueil
          </NavLink>
        </li>
        <li>
          <NavLink to="/batch" activeClassName="active">
            batchs
          </NavLink>
        </li>
        {user.role === "admin" && (
          <li>
            <NavLink to="/user" activeClassName="active">
              Utilisateurs
            </NavLink>
          </li>
        )}
        {user.role === "admin" && (
          <li>
            <NavLink to="/stats" activeClassName="active">
              Stats
            </NavLink>
          </li>
        )}
      </Nav>
    </Sidebar>
  );
};

const Sidebar = styled.div`
  background-color: #2e3444;
  height: 100%;
  max-width: 160px;
  width: 100%;
  z-index: 10;
  position: fixed;
  left: 0;
  top: 0;

  @media print {
    display: none;
  }
`;

const Nav = styled.ul`
  padding-top: 30px;
  list-style: none;
  a {
    text-decoration: none;
    padding: 15px 20px 10px;
    display: block;
    color: #b9cee9;
    font-size: 16px;
  }
  a.active,
  a:hover {
    background-color: #2b2f3a;
    color: #fff;
  }
`;
