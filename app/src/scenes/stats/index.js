import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container, Row, Col, Button } from "reactstrap";

import getSite from "./sites";
import api from "../../services/api";

import NumberTotalTests from "./NumberTotalTests";
import NumberRatePositive from "./NumberRatePositive";
import NumberDelay from "./NumberDelay";
import GraphPerDay from "./GraphPerDay";

export default () => {
  const [date, setDate] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const queries = [];
        queries.push({ index: "batch", type: "_doc" });
        queries.push({ query: { match_all: {} }, size: 1, sort: [{ date: { order: "desc" } }] });
        const { responses } = await api.esQuery(queries);
        const r = api.getHits(responses[0]);
        setDate(r[0]._source.date);
      } catch (e) {
        console.log("E", e);
      }
    })();
  }, []);

  return (
    <StyledContainer>
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {date ? `Données agrégées globales jusqu'au ${new Date(date).toLocaleDateString()}` : ""}
        <Button color="primary" size="md" onClick={() => print()}>
          Print
        </Button>
      </div>
      <DisplayBloc />
      <Sites />
    </StyledContainer>
  );
};

const DisplayBloc = ({ site = "", laboratory = "" }) => {
  // if (site !== "PARIS 4") return <div />;
  return (
    <Section>
      <div style={{ marginBottom: "20px" }}>{site ? `[${laboratory}] ${site}` : ""}</div>
      <Row>
        <NumberTotalTests site={site} />
        <NumberRatePositive site={site} />
        <NumberDelay site={site} />
      </Row>
      <GraphPerDay site={site} />
    </Section>
  );
};

const Sites = () => {
  const [sites, setSites] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const queries = [];
        queries.push({ index: "batch", type: "_doc" });
        queries.push({ query: { match_all: {} }, aggs: { stats: { terms: { field: "site.keyword", size: 100 } } }, size: 0 });
        const { responses } = await api.esQuery(queries);
        const r = api.getAggregations(responses[0]);
        let s = Object.keys(r);
        setSites(s);
      } catch (e) {
        console.log("E", e);
      }
    })();
  }, []);

  return (
    <div>
      {sites.map((e) => {
        return (
          <Section>
            <DisplayBloc site={e} laboratory={GetGroup(e)} />
            <hr />
          </Section>
        );
      })}
    </div>
  );
};

const StyledContainer = styled(Container)`
  padding: 30px 50px 0;
  @media print {
    padding: 0;
    hr,
    .btn {
      display: none;
    }
  }
`;

const Section = styled.div`
  @media print {
    margin-top: 60px;
    page-break-after: always;
  }
`;

const SectionTitle = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
  flex-grow: 1;
`;

function GetGroup(site) {
  switch (site) {
    case "PARIS 4":
      return "MLAB";
    case "Paris 13":
      return "Eurofins";
    case "Paris 15":
      return "Cerballiance";
    case "Paris 19":
      return "Bioclinic";
    case "Trappes":
      return "Eurofins";
    case "Mantes-la-Jolie":
      return "Cerballiance";
    case "Vitry-sur-Seine":
      return "Cerballiance";
    case "Paris 18":
      return "Biogroup LCD";
    case "Issy-les-Moulineaux":
      return "Biogroup LCD";
    case "Fontenay-sous-Bois":
      return "Bioclinic";
    case "Paris 17":
      return "Biogroup LCD";
    case "Evry":
      return "Cerballiance";
    case "La Défense (CNIT)":
      return "Biogroup LCD";
    case "Argenteuil":
      return "Biogroup LCD";
    case "Bondy":
      return "Bioclinic";
    case "Cergy":
      return "Cerballiance";
    case "Saint-Denis":
      return "Biogroup LCD";
    case "Lognes":
      return "Biofutur";
    case "Massy":
      return "Biogroup LCD";
    case "Dammarie-les-Lys":
      return "MLAB";
    default:
      "";
  }
}
