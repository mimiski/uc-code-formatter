
const INDENTATION_STRING = "    "
const LINE_ENDING = "\n"

const regexes = require("./regexes");

module.exports = {
  classDefinition: function (input) {
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
  }
}