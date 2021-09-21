const classes = require("./classes");
const utils = require("./utils");

const INDENTATION_STRING = "    ";
const LINE_ENDING = "\r\n";

const regexes = require("./regexes");

const applyReplace = (input, [regex, replacement]) => {
  return input.replace(regex, replacement);
};

module.exports = {
  classDefinitionFormatting: function (input) {
    function indentationFunc(index) {
      return index > 0 ? 1 : 0;
    }
    let regex = new RegExp(regexes.classDefinition);
    if (input.match(regex) != null) {
      let classDefinition = input.match(regex)[0];
      let lines = classDefinition.split(LINE_ENDING);
      let result = lines
        .map((line, index) => [line.trim(), indentationFunc(index)])
        .map(
          ([line, indentation]) =>
            INDENTATION_STRING.repeat(indentation) + line + LINE_ENDING
        )
        .join("");
      return input.replace(regex, result);
    } else {
      return input;
    }
  },

  repeatedNewlineFormatting: function (input) {
    const regex = new RegExp(LINE_ENDING + LINE_ENDING + LINE_ENDING);
    let oldResult = input.replace(regex, LINE_ENDING + LINE_ENDING);
    let result = oldResult.replace(regex, LINE_ENDING + LINE_ENDING);
    while (result != oldResult) {
      oldResult = result;
      result = oldResult.replace(regex, LINE_ENDING + LINE_ENDING);
    }
    return result;
  },

  forLoopHeaderFormatting: function (input) {
    const regexes = [
      [new RegExp("for[ |\t]*\\(", "g"), "for ("],
    ];

    return regexes.reduce(applyReplace, input);
  },

  ifHeaderFormatting: function (input) {
    const regexes = [
      [new RegExp("if[ |\t]*\\(", "g"), "if ("],
    ];

    return regexes.reduce(applyReplace, input);
  },

  switchHeaderFormatting: function (input) {
    const regexes = [
      [
        new RegExp("switch[ |\t]*\\([ |\t]*(.+?)[ |\t]*\\)", "g"),
        "switch ($1)",
      ],
    ];

    return regexes.reduce(applyReplace, input);
  },

  whileLoopHeader: function (input) {
    const regexes = [
      [new RegExp("while[ |\t]*\\(", "g"), "while ("],
    ];

    return regexes.reduce(applyReplace, input);
  },

  forLoopOneLiner: function (input) {
    return input.replace(/(for[ |\t]*\(.+\))[ |\t|\r|\n]*?([^{]+;)/, "$1{$2}");
  },

  whileLoopOneLiner: function (input) {
    return input.replace(
      /(while[ |\t]*\(.+\))[ |\t|\r|\n]*?([^{]*;)/,
      "$1{$2}"
    );
  },

  ifOneLiner: function (input) {
    return input.replace(/(if[ |\t]*\(.+\))[ |\t|\r|\n]*?([^{]*;)/, "$1{$2}");
  },

  curlyBracesLineSplitting: function (input) {
    const lines = input.split(LINE_ENDING);
    const regex1 = /([\S]+.*)\{/;
    const regex2 = /\{(.*?[\S]+)/;
    const regex3 = /([\S]+.*)\}/;
    const regex4 = /\}(.*?[\S]+)/;
    allLines = lines.flatMap((line) => {
      const result1 = line.replace(regex1, "$1" + LINE_ENDING + "{");
      const result2 = result1.replace(regex2, "{" + LINE_ENDING + "$1");
      const result3 = result2.replace(regex3, "$1" + LINE_ENDING + "}");
      const result4 = result3.replace(regex4, "}" + LINE_ENDING + "$1");
      return result4.split(LINE_ENDING);
    });
    allLinesWithEndings = allLines.map((line) => line + LINE_ENDING);
    result = allLinesWithEndings.join("");
    return result;
  },

  lineIndentation: function (inputString) {
    var contentBlocks = [];
    var indentation = 0;
    var blockStart = 0;
    let input = Array.from(inputString);

    for (i = 0; i < input.length; i++) {
      if (input[i] == "{") {
        if (blockStart != i - 1) {
          contentBlocks.push(
            new classes.ContentBlock(indentation, blockStart, i - 1)
          );
        }
        contentBlocks.push(new classes.ContentBlock(indentation, i - 1, i));
        blockStart = i;
        indentation = indentation + 1;
      }
      if (input[i] == "}") {
        if (blockStart != i - 1) {
          contentBlocks.push(
            new classes.ContentBlock(indentation, blockStart, i - 1)
          );
        }
        blockStart = i;
        indentation = indentation - 1;
        contentBlocks.push(new classes.ContentBlock(indentation, i - 1, i));
      }
    }

    contentBlocks.push(new classes.ContentBlock(indentation, blockStart, i));

    const splitIndexes = contentBlocks.map((c) => c.blockEnd);
    const indentations = contentBlocks.map((c) => c.indentation);

    let contentStrings = utils
      .splitArray(input, splitIndexes)
      .map((content) => content.join(""))
      .map((content) => content.replace(/^[\n|\r| ]*/, ""))
      .map((content) => content.replace(/[\n|\r| ]*$/, ""));

    let linesWithIndentation = utils
      .zip(contentStrings, indentations)
      .filter(([content, indentation]) => content != "")
      .flatMap(([content, indentation]) => {
        return content.split(LINE_ENDING).map((e) => [e, indentation]);
      });

    let result = linesWithIndentation
      .map(([line, indentation]) => {
        let pass0 = line.replace(/^[\n|\r| ]*/, "");
        let pass1 = pass0.replace(/[\n|\r| ]*$/, "");
        return INDENTATION_STRING.repeat(indentation) + pass1 + LINE_ENDING;
      })
      .join("");

    return result;
  },
};
