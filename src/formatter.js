const regexes = require("./regexes");
const reducers = require("./reducers");
const utils = require("./utils");

module.exports = {
  
  formatCode: function(input, debug=false) {
    let pipeline = [
      reducers.ifHeaderFormatting,
      reducers.forLoopHeaderFormatting,
      reducers.switchHeaderFormatting,
      reducers.whileLoopHeader,
      reducers.lineIndentation,
      reducers.classDefinitionFormatting,
      reducers.ifMultilineHeaderAlignment,
      reducers.repeatedNewlineFormatting,
    ];

    return utils.runPipeline(pipeline, input, debug);
  }
}
