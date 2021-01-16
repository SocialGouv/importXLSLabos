import React, { useState } from "react";
import styled from "styled-components";

import { DropzoneArea } from "material-ui-dropzone";
import { Progress, Container, Button } from "reactstrap";

import { toastr } from "react-redux-toastr";

import api from "../../services/api";
import { capture } from "../../services/sentry";
import { xlsxToObj } from "./file";

import BiogroupStrategy from "./BiogroupStrategy";
import CerballianceStrategy from "./CerballianceStrategy";
import LaScalaMlabStrategy from "./LaScalaMlabStrategy";
import Ars13Strategy from "./Ars13Strategy";

export default () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(false);

  const onChange = async (filesArr) => {
    try {
      if (!filesArr.length) return;
      const result = await xlsxToObj(filesArr[0]);
      const { batches, error } = convertToOurFormat(result);

      if (error) {
        capture(error);
        return setErrorMessage(error);
      }

      setTotal(batches.length);

      for (let i = 0; i < batches.length; i++) {
        batches[i].updated_at = new Date();
        const { ok, code } = await api.post(`/batch`, batches[i]);
        if (!ok) toastr.error(code);
        setProgress(i);
      }

      setDone(true);
      toastr.success("Import effectué!");
      capture("Import effectué!");
    } catch (e) {
      capture(e);
      setErrorMessage(e.message);
    }
  };

  return (
    <StyledContainer>
      {progress !== 0 && (
        <div style={{ height: "30px" }}>
          <Progress value={(progress * 100) / (total - 1)}>{`${progress}/${total - 1}`}</Progress>
        </div>
      )}
      {done && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            color="danger"
            onClick={() => {
              setDone(false);
              setProgress(0);
              setErrorMessage(null);
            }}
          >
            Importer un nouveau fichier
          </Button>
        </div>
      )}
      {!progress && (
        <DropzoneArea
          filesLimit={1}
          showPreviewsInDropzone={false}
          showAlerts={false}
          dropzoneText="Glissez / déposez votre fichier ici"
          acceptedFiles={["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]}
          onChange={onChange}
        />
      )}
      {!!errorMessage && <div style={{ marginTop: "20px" }}>{errorMessage}</div>}
    </StyledContainer>
  );
};

const convertToOurFormat = (results) => {
  const { objects } = results[0];

  if (objects[0]["Date de prélèvement"] === "Total") {
    capture("Biogroup import starting");
    return BiogroupStrategy(results);
  } else if (objects[0]["Laboratoire"] === "Cerballiance") {
    capture("Cerballiance import starting");
    return CerballianceStrategy(results);
  } else if (objects[0]["Laboratoire"] === "LA SCALA MLAB") {
    capture("LaScalaMlab import starting");
    return LaScalaMlabStrategy(results);
  } else if (objects[0].__EMPTY_1?.includes("ARS")) {
    capture("Ars13 Strategy import starting");
    return Ars13Strategy(results.slice(1));
  }

  return { error: "Votre fichier n'est pas valide. Veuillez contacter l'admin" };
};

const StyledContainer = styled(Container)`
  padding: 40px 50px 0;
`;
