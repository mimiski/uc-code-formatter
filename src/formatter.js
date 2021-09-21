const classes = require("./classes");
const regexes = require("./regexes");
const reducers = require("./reducers");
const utils = require("./utils");

module.exports = {
  
  formatCode: function(input) {
    let formatters = [
      reducers.forLoopOneLiner,
      reducers.whileLoopOneLiner,
      reducers.ifOneLiner,
      reducers.curlyBracesLineSplitting,
      reducers.lineIndentation,
      reducers.classDefinitionFormatting,
      reducers.ifHeaderFormatting,
      reducers.whileLoopHeader,
      reducers.forLoopHeaderFormatting,
      reducers.ifMultilineHeaderAlignment,
      reducers.repeatedNewlineFormatting,
    ];
  
    return formatters.reduce(utils.applyReducer, input);
  }
}
