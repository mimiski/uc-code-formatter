const classes = require("./classes");
const utils = require("./utils");

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
      let lines = classDefinition.split(utils.LINE_ENDING);
      let result = lines
        .map((line, index) => [line.trim(), indentationFunc(index)])
        .map(
          ([line, indentation]) =>
            utils.INDENTATION_STRING.repeat(indentation) + line + utils.LINE_ENDING
        )
        .join("");
      return input.replace(regex, result);
    } else {
      return input;
    }
  },

  repeatedNewlineFormatting: function (input) {
    const regex = new RegExp("(" + utils.LINE_ENDING + "){3,}", 'g');
    result = input.replace(regex, utils.LINE_ENDING + utils.LINE_ENDING);
    return result;
  },

  forLoopHeaderFormatting: function (input) {
    const regexes = [[new RegExp("for[ |\t]*\\(", "g"), "for ("]];

    return regexes.reduce(applyReplace, input);
  },

  ifHeaderFormatting: function (input) {
    const regexes = [[new RegExp("if[ |\t]*\\(", "g"), "if ("]];

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
    const regexes = [[new RegExp("while[ |\t]*\\(", "g"), "while ("]];

    return regexes.reduce(applyReplace, input);
  },

  forLoopOneLiner: function (input) {
    return input.replace(
      /(\bfor\b[ |\t]*\(.+\))([ |\t|\r|\n]*)([^{]+;)([ |\t|\r|\n]*)/,
      "$1" + utils.LINE_ENDING + "{"  + utils.LINE_ENDING + "$3"  + utils.LINE_ENDING + "}" + utils.LINE_ENDING
    );
  },

  whileLoopOneLiner: function (input) {
    return input.replace(
      /(\while\b[ |\t]*\(.+\))([ |\t|\r|\n]*)([^{]+;)([ |\t|\r|\n]*)/,
        "$1" + utils.LINE_ENDING + "{"  + utils.LINE_ENDING + "$3"  + utils.LINE_ENDING + "}" + utils.LINE_ENDING
    );
  },

  ifOneLiner: function (input) {
    return input.replace(
      /(\if\b[ |\t]*\(.+\))([ |\t|\r|\n]*)([^{]+;)([ |\t|\r|\n]*)/,
      "$1" + utils.LINE_ENDING + "{"  + utils.LINE_ENDING + "$3"  + utils.LINE_ENDING + "}" + utils.LINE_ENDING
    );
  },

  ifMultilineHeaderAlignment: function (input) {
    const regex = new RegExp("[ |\t]*if \\(([^;{}]|\n|\r|\\(|\\))+\\)", "g");
    const matches = input.match(regex);
    if (matches != null) {
      const replacements = matches.map((match) => {
        if (match.includes(utils.LINE_ENDING)) {
          const lines = match.split(utils.LINE_ENDING);
          return lines
            .map((lineContent, index) => {
              if (index > 0) {
                if (index < lines.length - 1) {
                  return utils.INDENTATION_STRING + lineContent + utils.LINE_ENDING;
                } else {
                  return utils.INDENTATION_STRING + lineContent;
                }
              } else {
                return lineContent + utils.LINE_ENDING;
              }
            })
            .join("");
        } else {
          return match;
        }
      });
      const matchesVsReplacements = utils
        .zip(matches, replacements)
        .filter(([match, replacement]) => match != replacement);
      var result = input;
      matchesVsReplacements.forEach(([match, replacement]) => {
        result = result.replace(match, replacement);
      });
      return result;
    } else {
      return input;
    }
  },

  lineIndentation: function (inputString) {
    var contentBlocks = [];
    var indentation = 0;
    var blockStart = 0;
    let input = Array.from(inputString);
    var quotesCounter = 0;
    var isCommented = false;

    const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);

    for (var i = 0; i < input.length; i++) {
      if (
        i + utils.LINE_ENDING.length < input.length &&
        equals(input.slice(i, i + utils.LINE_ENDING.length), utils.LINE_ENDING.split(""))
      ) {
        isCommented = false;
      } else if (
        i + 2 < input.length &&
        equals(input.slice(i, i + 2), ["/", "/"])
      ) {
        isCommented = true;
      }
      switch (input[i]) {
        case "{":
          if (quotesCounter % 2 == 1 || isCommented) {
            break;
          }
          if (blockStart != i - 1) {
            contentBlocks.push(
              new classes.ContentBlock(indentation, blockStart, i - 1)
            );
          }
          contentBlocks.push(new classes.ContentBlock(indentation, i - 1, i));
          blockStart = i;
          indentation = indentation + 1;
          break;
        case "}":
          if (quotesCounter % 2 == 1 || isCommented) {
            break;
          }
          if (blockStart != i - 1) {
            contentBlocks.push(
              new classes.ContentBlock(indentation, blockStart, i - 1)
            );
          }
          contentBlocks.push(
            new classes.ContentBlock(indentation - 1, i - 1, i)
          );
          blockStart = i;
          indentation = indentation - 1;
          break;
        case '"':
          quotesCounter++;
          break;
      }
    }

    contentBlocks.push(new classes.ContentBlock(indentation, blockStart, i));

    const splitIndexes = contentBlocks.map((c) => c.blockEnd);
    const indentations = contentBlocks.map((c) => c.indentation);

    let contentStrings = utils
      .splitArray(input, splitIndexes)
      .map((content) => content.join(""));

    let linesWithIndentation = utils
      .zip(contentStrings, indentations)
      .flatMap(([content, indentation]) => {
        return content.split(utils.LINE_ENDING).map((e) => [e, indentation]);
      });

    let result = linesWithIndentation
      .map(([line, indentation]) => {
        let pass0 = line.replace(/^[ |\t]*/, "");
        let pass1 = pass0.replace(/[ |\t]*$/, "");
        return utils.INDENTATION_STRING.repeat(indentation) + pass1;
      })
      .join(utils.LINE_ENDING);

    return result;
  },
};
