import React, { useState } from "react";
import { Container, Table, Row, Col } from "reactstrap";
import { ReactiveBase, ReactiveList, SelectedFilters, SingleList } from "@appbaseio/reactivesearch";
import styled from "styled-components";

import api from "../../services/api";

import { apiURL } from "../../config";

const FILTERS = ["LABO", "SITE", "QUERYBUILDER", "SearchResult"];

export default ({ history }) => {
  return (
    <Association>
      <ReactiveBase url={`${apiURL}/es`} app="batch" headers={{ Authorization: `JWT ${api.getToken()}` }}>
        <Container fluid style={{ padding: 20 }}>
          <Row>
            <Col md={3}>
              <SelectedFilters className="selected_filters" />
              <SingleList
                componentId="LABO"
                title="LABO"
                dataField="laboratory.keyword"
                react={{ and: FILTERS.filter((e) => e !== "LABO") }}
                showSearch={false}
                className="data-list"
              />
              <SingleList componentId="SITE" title="SITE" dataField="site.keyword" react={{ and: FILTERS.filter((e) => e !== "SITE") }} showSearch={false} className="data-list" />
            </Col>
            <Col md={9}>
              <ReactiveList
                componentId="SearchResult"
                react={{ and: FILTERS }}
                pagination={true}
                size={30}
                showLoader={true}
                loader="Loading..."
                dataField="created_at"
                sortOptions={[{ label: "date", dataField: "date", sortBy: "desc" }]}
                render={({ data }) => (
                  <Table>
                    <thead>
                      <tr>
                        <th>Laboratoire</th>
                        <th>Site</th>
                        <th>Updated_at</th>
                        <th>Moment</th>
                        <th>Tests</th>
                        <th>Positives</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((obj) => (
                        <tr key={obj._id} onClick={() => {}}>
                          <td>{obj.laboratory}</td>
                          <td>{obj.site}</td>
                          <td>{new Date(obj.updated_at).toLocaleDateString()}</td>
                          <td>{obj.moment}</td>
                          <td>{obj.test_total_count}</td>
                          <td>{obj.positive_count}</td>
                          <td>{obj.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              />
            </Col>
          </Row>
        </Container>
      </ReactiveBase>
    </Association>
  );
};

const Association = styled.div`
  margin-left: 160px;
  .search-icon {
    position: relative;
    top: -5px;
    path {
      fill: #000;
    }
  }

  .data-list {
    background-color: white;
    padding: 5px;
  }
`;
