import React, { useEffect, useState } from "react";
import { Container, Table, Modal, ModalHeader, ModalBody, Button, Row, Col, FormGroup, Input } from "reactstrap";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import { toastr } from "react-redux-toastr";

import LoadingButton from "../../components/loadingButton";
import api from "../../services/api";

import Header from "../../components/header";

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

export default () => {
  const [users, setUsers] = useState(null);
  const history = useHistory();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    (async () => {
      const { users: u } = await api.get("/user");
      setUsers(u);
    })();
  }, [refresh]);

  if (!users) return <div>loading...</div>;

  return (
    <div>
      <Header title="Users" />
      <Container style={{ padding: "40px 0" }}>
        <Create onChange={() => setRefresh(true)} />
        <Table hover>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Role</th>
              <th>Dernière connexion</th>
            </tr>
          </thead>
          <tbody>
            {users.map(({ _id, name, email, last_login_at, role }) => {
              return (
                <tr key={_id} onClick={() => history.push(`/user/${_id}`)}>
                  <td>{name}</td>
                  <td>{email}</td>
                  <td>{role}</td>
                  <td>{(last_login_at || "").slice(0, 10)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

const Create = ({ onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: 10, textAlign: "right" }}>
      <Button color="primary" size="sm" onClick={() => setOpen(true)}>
        Créer un utilisateur
      </Button>
      <Modal isOpen={open} toggle={() => setOpen(false)} size="lg">
        <ModalHeader toggle={() => setOpen(false)}>Créer un utilisateur</ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{ name: "", role: "normal", password: makeid(6), email: "" }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await api.post("/user", values);
                toastr.success("Created!");
                onChange();
                setOpen(false);
              } catch (e) {
                console.log(e);
                toastr.error("Some Error!", e.code);
              }
              setSubmitting(false);
            }}
          >
            {({ values, handleChange, handleSubmit, isSubmitting }) => (
              <React.Fragment>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <div>Nom</div>
                      <Input name="name" value={values.name} onChange={handleChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <div>Email</div>
                      <Input name="email" value={values.email} onChange={handleChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <div>Role</div>
                      <Input type="select" name="role" value={values.role} onChange={handleChange}>
                        <option value="normal">Normal</option>
                        <option value="admin">Admin</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <div>Mot de passe</div>
                      <Input name="password" value={values.password} onChange={handleChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <br />
                <LoadingButton loading={isSubmitting} color="info" onClick={handleSubmit}>
                  Save
                </LoadingButton>
              </React.Fragment>
            )}
          </Formik>
        </ModalBody>
      </Modal>
    </div>
  );
};
