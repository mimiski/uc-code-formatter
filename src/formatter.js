const classes = require("./classes");
const regexes = require("./regexes");
const reducers = require("./reducers");
const utils = require("./utils");

module.exports = {
  
  formatCode: function(input) {
    let formatters = [
      reducers.forLoopHeaderFormatting,
      reducers.forLoopOneLiner,
      reducers.whileLoopOneLiner,
      reducers.whileLoopHeader,
      reducers.ifOneLiner,
      reducers.ifHeaderFormatting,
      reducers.curlyBracesLineSplitting,
      reducers.lineIndentation,
      reducers.classDefinitionFormatting,
      reducers.repeatedNewlineFormatting,
    ];
  
    return formatters.reduce(utils.applyReducer, input);
  }
}
