import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import styled from "styled-components";

import { KEY_MORNING, KEY_AFTERNOON, KEY_NOTSPECIFIED } from "./constants";

import api from "../../services/api";

export default ({ site }) => {
  const [total, setTotal] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const queries = [];
        queries.push({ index: "batch", type: "_doc" });
        queries.push({ query: { match_all: {} }, size: 0, aggs: { total: { sum: { field: "test_total_count" } } } });
        if (site) queries[1].query = { bool: { must: [{ term: { "site.keyword": site } }] } };

        queries.push({ index: "batch", type: "_doc" });
        queries.push({ query: { match_all: {} }, size: 0, aggs: { moment: { terms: { field: "moment.keyword" }, aggs: { total: { sum: { field: "positive_count" } } } } } });
        if (site) queries[3].query = { bool: { must: [{ term: { "site.keyword": site } }] } };

        const { responses } = await api.esQuery(queries);

        const r = api.getAggregations(responses[0]);

        const get = (key) => responses[1]?.aggregations?.moment?.buckets.find((e) => e.key === key)?.total.value || 0;

        const m = get(KEY_MORNING);
        const a = get(KEY_AFTERNOON);
        const ns = get(KEY_NOTSPECIFIED);
        setTotal((((m + a + ns) * 100) / r).toFixed(2));
      } catch (e) {
        console.log("E", e);
      }
    })();
  }, []);

  return (
    <Col>
      <Card>
        <Title>Taux de positivité</Title>
        <Value>{`${total}%`}</Value>
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

const Legend = styled.div`
  font-size: 12px;
  margin-bottom: 10px;
  flex-grow: 1;
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
