const regexes = require("./regexes");
const reducers = require("./reducers");
const utils = require("./utils");

module.exports = {
  
  formatCode: function(input, debug=false) {
    let pipeline = [
      reducers.forLoopOneLiner,
      reducers.whileLoopOneLiner,
      reducers.ifOneLiner,
      reducers.lineIndentation,
      reducers.classDefinitionFormatting,
      reducers.ifHeaderFormatting,
      reducers.whileLoopHeader,
      reducers.forLoopHeaderFormatting,
      reducers.ifMultilineHeaderAlignment,
      reducers.repeatedNewlineFormatting,
    ];

    return utils.runPipeline(pipeline, input, debug);
  }
}
