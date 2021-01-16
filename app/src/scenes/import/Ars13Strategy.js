export default (results) => {
  const data = [];

  for (let tabIndex = 0; tabIndex < results.length; tabIndex++) {
    const { objects } = results[tabIndex];

    for (let i = 1; i < objects.length; i++) {
      const batch = objects[i];

      let site = batch["CORRESPONDANT"];
      if (!site) return { error: `Impossible de trouver la colonne "CORRESPONDANT"` };
      const registerDate = batch["DATE_ENR_DOSSIER"];
      if (!registerDate) return { error: `Impossible de trouver la colonne "DATE_ENR_DOSSIER"` };
      const registerTime = batch["HEURE_ENR_DOSSIER"];
      if (!registerTime) return { error: `Impossible de trouver la colonne "HEURE_ENR_DOSSIER"` };
      const resultDate = batch["DATE_VALIDATION"];
      if (!resultDate) return { error: `Impossible de trouver la colonne "DATE_VALIDATION"` };
      const resultTime = batch["HEURE_VALIDATION"];
      if (!resultTime) return { error: `Impossible de trouver la colonne "HEURE_VALIDATION"` };
      const result = batch["RESULTAT"];
      if (!result) return { error: `Impossible de trouver la colonne "RESULTAT"` };

      switch (site) {
        case "ARS13":
          site = "Paris 13";
          break;
        case "Trappes":
        case "ARS78":
          site = "Trappes";
          break;
        default:
          return { error: `Code non reconnu "${site}"` };
      }

      const registerDateTime = convertToDate(registerDate, registerTime);
      const resultDateTime = convertToDate(resultDate, resultTime);

      const negative_count = result == "Negatif" ? 1 : 0;
      const positive_count = result == "Positif" ? 1 : 0;
      const delay = ((resultDateTime - registerDateTime) / (1000 * 60 * 60 * 24)).toFixed(2);
      const moment = registerTime.split("h")[0] >= 14 ? "Après-Midi" : "Matin";

      const m = registerDate.split("/")[0];
      const d = registerDate.split("/")[1];
      const y = registerDate.split("/")[2];
      const date = `20${y}-${m}-${d}`;

      const f = data.find((e) => e.site === site && e.date === date && e.moment === moment);

      if (!f) {
        data.push({
          site,
          laboratory: "ARS",
          date,
          moment,
          delay,
          test_symptomatic_count: 0,
          test_asymptomatic_count: 0,
          test_unspecified_count: 1,
          test_total_count: 1,
          negative_count,
          positive_count,
        });
      } else {
        f.delay = (f.delay * f.test_total_count + delay * 1) / (f.test_total_count + 1);

        f.test_unspecified_count = ++f.test_unspecified_count;
        f.test_total_count = ++f.test_total_count;

        f.negative_count = f.negative_count + negative_count;
        f.positive_count = f.positive_count + positive_count;
      }
    }
  }

  return { batches: data };
};

function convertToDate(date, time) {
  const d = new Date(date);
  const timeArr = time.split("h");

  d.setMinutes(timeArr[1]);
  d.setHours(timeArr[0]);

  return d;
}
