function applyReducer(accumulator, f) {
  const input = accumulator[accumulator.length - 1];
  const output = f(input);
  return accumulator.concat([output]);
}

function zip(a, b) {
  return a.map((k, i) => [k, b[i]]);
}

module.exports = {

  LINE_ENDING: "\r\n",

  INDENTATION_STRING: "    ",

  splitArray: function (array, indexes) {
    return array.reduce(
      (p, c, i) => {
        if (i - 1 === indexes[0]) {
          indexes.shift();
          p.push([]);
        }
        p[p.length - 1].push(c);
        return p;
      },
      [[]]
    );
  },

  zip: function (a, b) {
    return zip(a, b);
  },

  runPipeline: function (reducers, input, debug = false) {
    const stepResults = reducers.reduce(applyReducer, [input]);

    if (debug) {
      const debugInfo = zip(reducers, stepResults.slice(1));

      console.log("--- started input --- ");
      console.log(stepResults[0]);
      console.log("--- ended input --- ");
      console.log("");
      for (const i in debugInfo) {
        const [f, result] = debugInfo[i];
        console.log("--- started step %s --- ", f.name);
        console.log(result);
        console.log("--- ended step %s --- ", f.name);
        console.log("");
      }
    }

    const result = stepResults[stepResults.length - 1];
    return result;
  },
};
