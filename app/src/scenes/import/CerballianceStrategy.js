const CerballianceStrategy = (results) => {
  const arr = [];

  for (let tabIndex = 0; tabIndex < results.length; tabIndex++) {
    const { objects } = results[tabIndex];

    for (let i = 0; i < objects.length; i++) {
      const batch = objects[i];
      const obj = {};

      obj.laboratory = "CERBALLIANCE";

      const date = batch["Date des prélèvements"];
      if (date === undefined) return { error: `Impossible de trouver la colonne "Date des prélèvements"` };

      const test_total_count = batch["Nombre de tests effectués"];
      if (test_total_count === undefined) return { error: `Impossible de trouver la colonne "Nombre de tests effectués"` };

      const test_symptomatic_count = batch["Nombre de patients symptomatiques testés"];
      if (test_symptomatic_count === undefined) return { error: `Impossible de trouver la colonne "Nombre de patients symptomatiques testés"` };

      const delay = parseFloat(batch["Délai moyen de rendu des résultats"] || 0);
      if (delay === undefined) return { error: `Impossible de trouver la colonne "Délai moyen de rendu des résultats"` };

      const moment = batch[" Matin / Après-Midi "];
      if (moment === undefined) return { error: `Impossible de trouver la colonne " Matin / Après-Midi "` };

      const tx = batch["Taux de positivité"];
      if (tx === undefined) return { error: `Impossible de trouver la colonne " Taux de positivité "` };

      const code = batch["Code Correspondant"];
      if (code === undefined) return { error: `Impossible de trouver la colonne "Code Correspondant"` };

      const m = date.split("/")[0];
      const d = date.split("/")[1];
      const y = date.split("/")[2];
      const str = `20${y}-${m}-${d}`;
      obj.date = new Date(str);
      console.log("date", date, obj.date, test_total_count);
      obj.test_total_count = parseInt(test_total_count || 0);
      obj.moment = moment;
      obj.delay = delay;

      obj.test_symptomatic_count = parseInt(test_symptomatic_count || 0);
      obj.test_asymptomatic_count = test_total_count - test_symptomatic_count;

      obj.positive_count = parseInt((tx * test_total_count) / 100);
      obj.negative_count = test_total_count - obj.positive_count;

      switch (code) {
        case "ARSEV":
          obj.site = "Evry";
          break;
        case "ARSMA":
          obj.site = "Mantes-la-Jolie";
          break;
        case "ARSVI":
          obj.site = "Vitry-sur-Seine";
          break;
        case "15BAR":
          obj.site = "Paris 15";
          break;
        case "ARSPO":
          obj.site = "Cergy";
          break;
        default:
          return { error: `Code inconnu "${code}"` };
      }

      const f = arr.find((e) => e.moment === obj.moment && e.date === obj.date && e.site === obj.site);
      if (f) {
        f.delay = (obj.delay * obj.test_total_count + f.delay * f.test_total_count) / (f.test_total_count + obj.test_total_count);
        f.test_total_count += obj.test_total_count;
        f.test_symptomatic_count += obj.test_symptomatic_count;
        f.test_asymptomatic_count += obj.test_asymptomatic_count;
        f.positive_count += obj.positive_count;
        f.negative_count += obj.negative_count;
        continue;
      }

      arr.push(obj);
    }
  }

  return { batches: arr };
};

export default CerballianceStrategy;
