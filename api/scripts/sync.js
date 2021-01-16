require("dotenv").config({ path: "../.env" });
require("../src/mongo");

(async function fetch() {
  try {
    const ObjectModel = require(`../src/models/batch`);
    await ObjectModel.unsynchronize();
    let count = 0;
    const cursor = ObjectModel.find().cursor();
    await cursor.eachAsync(async function (doc) {
      if (count++ % 10 === 0) console.log(count);
      await doc.index();
    });
    console.log("END");
  } catch (e) {
    console.log("e", e);
  }
})();
