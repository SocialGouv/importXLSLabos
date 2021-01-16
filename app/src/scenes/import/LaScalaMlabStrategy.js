const getMonthIndexByName = (name) => {
  switch (name) {
    case "janvier":
      return "01";
    case "février":
      return "02";
    case "mars":
      return "03";
    case "avril":
      return "04";
    case "mai":
      return "05";
    case "juin":
      return "06";
    case "juillet":
      return "07";
    case "août":
      return "08";
    case "septembre":
      return "09";
    case "octobre":
      return "10";
    case "novembre":
      return "11";
    case "décembre":
      return "12";
  }
};
const LaScalaMlabStrategy = (results) => {
  const arr = [];

  for (let tabIndex = 0; tabIndex < results.length; tabIndex++) {
    const { objects } = results[tabIndex];

    for (let i = 1; i < objects.length; i++) {
      const batch = objects[i];
      const obj = {};

      try {
        obj.site = batch["Site"];
        if (obj.site === undefined) return { error: `Impossible de trouver la colonne "Site"` };

        obj.laboratory = "LA SCALA MLAB";

        const transformDate = (dateFormat) => {
          console.log("dateFormat", dateFormat);
          const [, date, monthName, yearName] = dateFormat.replace("  ", " ").split(" ");
          const year = yearName ? parseInt(yearName, 10) : 2020;
          const month = getMonthIndexByName(monthName.toLowerCase());
          const day = parseInt(date, 10);
          const str = `${year}-${month}-${day}`;
          console.log(`str`, str);
          return new Date(str);
        };
        const date = batch["Date des prélèvements"];
        obj.date = date ? transformDate(date) : undefined;

        console.log("obj.date", obj.date);

        if (obj.date === undefined) return { error: `Impossible de trouver la colonne "Date des prélèvements"` };

        obj.test_symptomatic_count = parseInt(batch["Nombre de patients symptomatiques testés"], 10);
        if (obj.test_symptomatic_count === undefined) return { error: "Nombre de patients symptomatiques testés" };

        obj.test_total_count = parseInt(batch["Nombre de tests effectués"], 10);
        if (obj.test_total_count === undefined) return { error: `Impossible de trouver la colonne "Nombre de tests effectués"` };

        obj.test_asymptomatic_count = obj.test_total_count - obj.test_symptomatic_count;

        let tx = batch["Taux de positivité"];
        if (tx === undefined) return { error: `Impossible de trouver la colonne "Taux de positivité"` };
        tx = parseFloat(tx);

        const transformDelayToDays = (delayInHours) => {
          if (!delayInHours) return;
          return parseFloat(delayInHours) / 24;
        };

        obj.delay = transformDelayToDays(batch["Délai moyen de rendu des résultats"]);
        if (obj.delay === undefined) return { error: `Impossible de trouver la colonne "Délai moyen de rendu des résultats"` };

        obj.positive_count = parseInt((tx * obj.test_total_count) / 100);
        obj.negative_count = obj.test_total_count - obj.positive_count;
        obj.moment = "Matin";

        arr.push(obj);
      } catch (e) {
        return { error: `Erreur ligne ${i} ; ${JSON.stringify(batch)}`, e };
      }
    }
  }

  return { batches: arr };
};

export default LaScalaMlabStrategy;
