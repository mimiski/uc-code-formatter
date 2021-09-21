module.exports = {
  
  splitArray: function(array, indexes) {
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

  zip: function(a, b) {
    return a.map((k, i) => [k, b[i]]);
  },
  
  applyReducer: function(x, f) {
    return f(x);
  }
}