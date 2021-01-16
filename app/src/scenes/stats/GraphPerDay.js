import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ResponsiveBar } from "@nivo/bar";
import { KEY_MORNING, KEY_AFTERNOON, KEY_NOTSPECIFIED } from "./constants";
import api from "../../services/api";

export default ({ site }) => {
  const [histogram, setHistogram] = useState(null);
  const KEY_MORNING_COLOR = "#a6cee3";
  const KEY_AFTERNOON_COLOR = "#418cbf";
  const KEY_NOTSPECIFIED_COLOR = "#B2DF89";

  useEffect(() => {
    (async () => {
      try {
        const queries = [];
        queries.push({ index: "batch", type: "_doc" });
        queries.push({
          query: { match_all: {} },
          aggs: {
            stats: {
              date_histogram: { field: "date", interval: "week" },
              aggs: { moment: { terms: { field: "moment.keyword" }, aggs: { total: { sum: { field: "test_total_count" } } } } },
            },
          },
          size: 0,
        });

        if (site) queries[1].query = { bool: { must: [{ term: { "site.keyword": site } }] } };

        const { responses } = await api.esQuery(queries);

        const raw = responses[0].aggregations.stats.buckets;
        const data = Object.keys(raw).map((key) => {
          const t = raw[key];
          const obj = {};
          let d = new Date(t.key);

          obj.date = d.toISOString().slice(0, 10);

          obj[KEY_AFTERNOON] = t.moment.buckets.find((e) => e.key === KEY_AFTERNOON)?.total.value || 0;
          obj[KEY_MORNING] = t.moment.buckets.find((e) => e.key === KEY_MORNING)?.total.value || 0;
          obj[KEY_NOTSPECIFIED] = t.moment.buckets.find((e) => e.key === KEY_NOTSPECIFIED)?.total.value || 0;
          return obj;
        });
        setHistogram(data);
      } catch (e) {
        console.log("E", e);
      }
    })();
  }, []);

  if (!histogram) return <div>Loading...</div>;

  return (
    <Card style={{ height: 600 }}>
      {/* <Title>{`[${site || "Global"}] Nombre total de tests par date, ventilé matin / Après-Midi`}</Title> */}
      <div>
        <BarLegend color={KEY_AFTERNOON_COLOR}>Après-Midi [Bleu foncé]</BarLegend>
        <BarLegend color={KEY_MORNING_COLOR}>Matin [Bleu clair]</BarLegend>
        <BarLegend color={KEY_NOTSPECIFIED_COLOR}>Non spécifié [Vert]</BarLegend>
      </div>
      <ResponsiveBar
        data={histogram}
        indexBy="date"
        // colors={["#418cbf", "#a6cee3", "#B2DF89"]}
        keys={[KEY_MORNING, KEY_AFTERNOON, KEY_NOTSPECIFIED]}
        margin={{ top: 20, right: 20, bottom: 90, left: 60 }}
        padding={0.3}
        colors={(e) => {
          if (e.id === KEY_NOTSPECIFIED) return KEY_NOTSPECIFIED_COLOR;
          if (e.id === KEY_MORNING) return KEY_MORNING_COLOR;
          if (e.id === KEY_AFTERNOON) return KEY_AFTERNOON_COLOR;
          return "red";
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 75,
          legend: "Date",
          legendPosition: "middle",
          legendOffset: 80,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Total Test",
          legendPosition: "middle",
          legendOffset: -50,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </Card>
  );
};

const Card = styled.div`
  border-radius: 18px;
  box-shadow: 0 5px 31px 0 #d7dce3;
  margin-bottom: 30px;
  padding: 20px 30px;
  height: 280px;
  background: #fff;
  color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Legend = styled.div`
  font-size: 12px;
  margin-bottom: 10px;
  flex-grow: 1;
`;

const BarLegend = styled.div`
  font-size: 15px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  ::before {
    content: "";
    height: 16px;
    width: 16px;
    background-color: ${({ color }) => color};
    margin-right: 8px;
  }
`;
