import XLSX, { utils } from "xlsx";

export const xlsxToObj = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array", raw: true, cellDates: true });
      let result = [];

      workbook.SheetNames.forEach((sheetName) => {
        const xlRowObject = utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false });
        result = [...result, { name: sheetName, objects: xlRowObject }];
      });

      return resolve(result);
    };

    reader.readAsArrayBuffer(file);
  });
};
