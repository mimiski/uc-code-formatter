
const INDENTATION_STRING = "    "
const LINE_ENDING = "\r\n"

const regexes = require("./regexes");

module.exports = {
  classDefinitionFormatting: function (input) {
    function indentationFunc(index) {
      return (index > 0 ? 1 : 0)
    };
    let regex = new RegExp(regexes.classDefinition, 'g');
    let classDefinition = input.match(regex)[0];
    let lines = classDefinition.split("\n");
    console.log(lines);
    let result = lines
      .map((line, index) => [line.trim(), indentationFunc(index)])
      .map(
        ([line, indentation]) => INDENTATION_STRING.repeat(indentation) + line
      )
      .join(LINE_ENDING);
    return result;
  },

  repeatedNewlineFormatting: function (input) {
    const regex = new RegExp(LINE_ENDING + LINE_ENDING + LINE_ENDING);
    let oldResult = input.replace(regex, LINE_ENDING + LINE_ENDING);
    let result = oldResult.replace(regex, LINE_ENDING + LINE_ENDING);
    while(result != oldResult) {
      oldResult = result;
      result = oldResult.replace(regex, LINE_ENDING + LINE_ENDING);
    }
    return result;
  },

  loopHeaderFormatting: function (input) {
    const regex = new RegExp(regexes.loopHeader, 'g');
    const match = input.match(regex);
    console.log(match);
    result = input.replace(regex, 'for ($1 $2 $3; $4 $5 $6; $7)')
    return result;
  }
}