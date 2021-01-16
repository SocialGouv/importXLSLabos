const BiogroupStrategy = (results) => {
  const arr = [];

  for (let tabIndex = 0; tabIndex < results.length; tabIndex++) {
    const { name, objects } = results[tabIndex];

    for (let i = 1; i < objects.length; i++) {
      const batch = objects[i];
      const obj = {};

      obj.site = name;
      obj.laboratory = "BIOGROUP";

      const date = batch["Date de prélèvement"];
      if (date === undefined) return { error: `Impossible de trouver la colonne "Date des prélèvements"` };

      const test_symptomatic_count = parseInt(batch["Nb de patients symptomatiques testés"], 10);
      if (test_symptomatic_count === undefined) return { error: `Impossible de trouver la colonne "Nb de patients symptomatiques testés"` };
      const test_total_count = parseInt(batch["Nb de PCR réalisées"], 10);
      if (test_total_count === undefined) return { error: `Impossible de trouver la colonne "Nb de PCR réalisées"` };
      const positive_count = parseInt(batch["Nb de PCR Positives"], 10);
      const delay = batch["Délai moyen de rendu des résultats urgents (hh:mm)"];
      if (delay === undefined) return { error: `Impossible de trouver la colonne "Délai moyen de rendu des résultats urgents (hh:mm)"` };

      const transformDelayToDays = (delayInHHMM) => {
        if (!delayInHHMM) return;
        const splitted = delayInHHMM.split(":").map((part) => parseInt(part, 10));
        return (splitted[0] + splitted[1] / 60 + splitted[2] / 3600) / 24;
      };

      switch (name) {
        case "Issy": {
          obj.site = "Issy-les-Moulineaux";
          obj.moment = "Matin";
          break;
        }
        case "Mairie 75018": {
          obj.site = "Paris 18";
          obj.moment = "Matin";
          break;
        }
        case "CNIT": {
          obj.site = "La Défense (CNIT)";
          obj.moment = "Matin";
          break;
        }
        case "Argenteuil": {
          obj.site = "Argenteuil";
          obj.moment = "Non spécifié";
          break;
        }
        case "75017": {
          obj.site = "Paris 17";
          obj.moment = "Matin";
          break;
        }
        case "Saint-denis": {
          obj.site = "Saint-Denis";
          obj.moment = "Matin";
          break;
        }
        case "Massy": {
          obj.site = "Massy";
          obj.moment = "Matin";
          break;
        }
        default:
          return { error: `Site inconnu "${name}"` };
      }

      obj.delay = transformDelayToDays(delay);
      obj.date = date ? new Date(date) : undefined;
      obj.test_symptomatic_count = test_symptomatic_count;
      obj.test_total_count = test_total_count;
      obj.positive_count = positive_count;
      obj.test_asymptomatic_count = obj.test_total_count - obj.test_symptomatic_count;
      obj.negative_count = obj.test_total_count - obj.positive_count;

      arr.push(obj);
    }
  }

  return { batches: arr };
};

export default BiogroupStrategy;
