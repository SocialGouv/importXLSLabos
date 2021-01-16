import React, { useEffect, useState } from "react";
import { Col } from "reactstrap";
import styled from "styled-components";
import api from "../../services/api";

export default ({ site }) => {
  const [total, setTotal] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const queries = [];
        queries.push({ index: "batch", type: "_doc" });
        queries.push({ query: { match_all: {} }, size: 0, aggs: { total: { avg: { field: "delay" } } } });
        if (site) queries[1].query = { bool: { must: [{ term: { "site.keyword": site } }] } };
        const { responses } = await api.esQuery(queries);
        const total = api.getAggregations(responses[0]);
        setTotal(total.toFixed(2));
      } catch (e) {
        console.log("E", e);
      }
    })();
  }, []);

  return (
    <Col>
      <Card>
        <Title>Délai moyen </Title>
        <Value>
          {total} <span style={{ fontSÎize: "19px" }}>jours</span>
        </Value>
      </Card>
    </Col>
  );
};

const Card = styled.div`
  border-radius: 18px;
  box-shadow: 0 5px 31px 0 #d7dce3;
  margin-bottom: 30px;
  padding: 20px 30px;
  height: 150px;
  background: #fff;
  color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media print {
    border: 1px solid #ddd;
  }
`;

const Title = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
  flex-grow: 1;
`;

const Value = styled.div`
  font-size: 40px;
  text-align: center;
  flex-grow: 2;
`;
