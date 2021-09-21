const classes = require("./classes");
const regexes = require("./regexes");
const reducers = require("./reducers");
const utils = require("./utils");

module.exports = {
  
  formatCode: function(input) {
    let formatters = [
      reducers.loopHeaderFormatting,
      reducers.forLoopOneLiner,
      reducers.curlyBracesLineSplitting,
      reducers.lineIndentation,
      reducers.classDefinitionFormatting,
      reducers.repeatedNewlineFormatting,
    ];
  
    return formatters.reduce(utils.applyReducer, input);
  }
}
