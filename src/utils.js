function applyReducer(accumulator, f) {
  const input = accumulator[accumulator.length - 1];
  const output = f(input);
  return accumulator.concat([output]);
}

module.exports = {
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
    return a.map((k, i) => [k, b[i]]);
  },

  runPipeline: function (reducers, input) {
    const stepResults = reducers.reduce(applyReducer, [input]);

    for (const i in stepResults) {
      console.log(stepResults[i]);
    }

    const result = stepResults[stepResults.length - 1];
    return result;
  },
};
