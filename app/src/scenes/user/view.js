import React, { useEffect, useState } from "react";
import { Container, Nav, NavItem, NavLink, TabContent, TabPane, FormGroup, Input, Label, Button, Row, Col } from "reactstrap";

import { useParams, Redirect } from "react-router-dom";
import { Formik } from "formik";
import { toastr } from "react-redux-toastr";

import api from "../../services/api";
import LoadingButton from "../../components/loadingButton";
import Header from "../../components/header";

export default () => {
  const [activeTab, setActiveTab] = useState("1");
  const [user, setUser] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const { user: u } = await api.get(`/user/${id}`);
      setUser(u);
    })();
  }, []);

  async function deleteData() {
    const confirm = window.confirm("Are you sure ?");
    if (confirm) {
      await api.remove(`/user/${id}`);
      setDeleted(true);
      toastr.success("successfully removed!");
    }
  }

  if (!user) return <div>Chargement...</div>;

  if (deleted) return <Redirect to="/" />;

  return (
    <div>
      <Header title={user.name} />

      <Container style={{ padding: "40px 0" }}>
        <Nav tabs style={{ marginBottom: 30 }}>
          <NavItem>
            <NavLink style={{ backgroundColor: activeTab === "1" && "#eee" }} onClick={() => setActiveTab("1")}>
              View
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink style={{ backgroundColor: activeTab === "2" && "#eee" }} onClick={() => setActiveTab("2")}>
              Raw
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Formik
              initialValues={user}
              onSubmit={async (values) => {
                try {
                  await api.put(`/user?user_id=${user._id}`, values);
                  toastr.success("Updated!");
                } catch (e) {
                  console.log(e);
                  toastr.error("Some Error!");
                }
              }}
            >
              {({ values, handleChange, handleSubmit, isSubmitting }) => (
                <React.Fragment>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Name</Label>
                        <Input name="name" value={values.name} onChange={handleChange} />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Email</Label>
                        <Input disabled name="email" value={values.email} onChange={handleChange} />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Role</Label>
                        <Input type="select" name="role" value={values.role} onChange={handleChange}>
                          <option value="admin">Admin</option>
                          <option value="normal">Normal</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <LoadingButton loading={isSubmitting} color="info" onClick={handleSubmit}>
                      Mettre à jour
                    </LoadingButton>
                    <Button style={{ marginLeft: 10 }} color="danger" onClick={deleteData}>
                      Supprimer
                    </Button>
                  </div>
                </React.Fragment>
              )}
            </Formik>
          </TabPane>
          <TabPane tabId="2">
            <pre>
              {Object.keys(user).map((e) => (
                <div>
                  <strong>{e}:</strong> {JSON.stringify(user[e])}
                </div>
              ))}
            </pre>
          </TabPane>
        </TabContent>
      </Container>
    </div>
  );
};
