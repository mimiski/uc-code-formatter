const classes = require("./classes");
const regexes = require("./regexes");
const reducers = require("./reducers");
  
function forLoopsSingleLiners(input) {
  return input.replace(/(for\(.*\))([^{]*;)/, "$1{$2}");
}

function getContentType(content, stack) {
  var previousBlockType = null;
  var previousPreviousBlockType = null;
  if(stack.length > 1)
    previousBlockType = stack[stack.length - 1];
  if(stack.length > 2)
    previousPreviousBlockType = stack[stack.length - 2];
  if (content.match(/class.* extends/)) {
    return BLOCK_TYPE.classDefinition;
  } else if (content.includes("var")) {
    return BLOCK_TYPE.classAttributesDefinition;
  } else if (content.includes("{")) {
    return BLOCK_TYPE.openCurlyBraces;
  } else if (content.includes("}")) {
    return BLOCK_TYPE.closeCurlyBraces;
  } else if (content.match(/for\(.*\)/) || content.match(/while\(.*\)/)) {
    return BLOCK_TYPE.loopHeader;
  } else if (
    !content.includes("}") &&
    previousPreviousBlockType == BLOCK_TYPE.loopHeader &&
      previousBlockType == BLOCK_TYPE.openCurlyBraces
  ) {
    return BLOCK_TYPE.loopBody;
  } else if (content.includes("if")) {
    return BLOCK_TYPE.ifHeader;
  } else if (
    !content.includes("}") &&
    previousPreviousBlockType == BLOCK_TYPE.ifHeader &&
      previousBlockType == BLOCK_TYPE.openCurlyBraces
  ) {
    return BLOCK_TYPE.ifBody;
  } else if (content.includes("switch")) {
    return BLOCK_TYPE.switchHeader;
  } else if (
    !content.includes("}") &&
    previousPreviousBlockType == BLOCK_TYPE.switchHeader &&
      previousBlockType == BLOCK_TYPE.openCurlyBraces
  ) {
    return BLOCK_TYPE.switchBody;
  } else if (content.includes("defaultproperties")) {
    return BLOCK_TYPE.defautPropertiesBody;
  }else if (content.includes("defaultproperties")) {
    return BLOCK_TYPE.defautPropertiesBody;
  }
  return null;
}

function formatIndentation(inputString) {
  var contentBlocks = [];
  var indentation = 0;
  var blockStart = 0;
  let input = Array.from(inputString);

  for (i = 0; i < input.length; i++) {
    if (input[i] == "{") {
      contentBlocks.push(new ContentBlock(indentation, blockStart, i - 1));
      contentBlocks.push(new ContentBlock(indentation, i - 1, i));
      blockStart = i;
      indentation = indentation + 1;
    }
    if (input[i] == "}") {
      contentBlocks.push(new ContentBlock(indentation, blockStart, i - 1));
      blockStart = i;
      indentation = indentation - 1;
      contentBlocks.push(new ContentBlock(indentation, i - 1, i));
    }
  }

  function splitArray(array, indexes) {
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
  }

  function zip(a, b) {
    return a.map((k, i) => [k, b[i]]);
  }

  let splitIndexes = contentBlocks.map((c) => c.blockStart);
  let indentations = contentBlocks.map((c) => c.indentation);

  let contents = splitArray(input, splitIndexes).map((content) => {
    return content
      .join("")
      .replace(/^[\n|\r| ]*/, "")
      .replace(/[\n|\r| ]*$/, "");
  });

  // console.log(contents);

  let contentWithIndentation = zip(contents, indentations);

  var stack = [];
  let codeBlocks = contentWithIndentation.map(([content, indentation]) => {
    type = getContentType(content, stack);
    stack.push(type);
    switch (type) {
      case BLOCK_TYPE.classDefinition:
        lines = content.split("\r\n").map((lineContent, index) => {
          if (index == 0) {
            return new classes.Line(indentation, lineContent);
          } else {
            return new classes.Line(indentation + 1, lineContent);
          }
        });
        return new classes.CodeBlock(lines, type, content);
      case BLOCK_TYPE.ifHeader:
        lines = content.split("\r\n").map((lineContent) => {
          return new classes.Line(indentation, lineContent);
        });
        return new classes.CodeBlock(lines, type, content);
      case BLOCK_TYPE.loopHeader:
        lines = content.split("\r\n").map((lineContent) => {
          return new classes.Line(indentation, lineContent);
        });
        return new classes.CodeBlock(lines, type, content);
      case BLOCK_TYPE.switchHeader:
        lines = content.split("\r\n").map((lineContent) => {
          return new classes.Line(indentation, lineContent);
        });
        return new classes.CodeBlock(lines, type, content);
      case BLOCK_TYPE.defautPropertiesHeader:
        lines = content.split("\r\n").map((lineContent) => {
          return new classes.Line(indentation, lineContent);
        });
        return new classes.CodeBlock(lines, type, content);
      case BLOCK_TYPE.openCurlyBraces:
        lines = content.split("\r\n").map((lineContent) => {
          return new classes.Line(indentation, lineContent);
        });
        return new classes.CodeBlock(lines, type, content);
      case BLOCK_TYPE.closeCurlyBraces:
        lines = content.split("\r\n").map((lineContent) => {
          return new classes.Line(indentation, lineContent);
        });
        return new classes.CodeBlock(lines, type, content);
      default:
        console.log(content);
        lines = content.trim().split(";").map((lineContent) => {
          return new classes.Line(indentation, lineContent + ";");
        });
        return new classes.CodeBlock(lines, type, content);
    }
  });

  console.log(codeBlocks);

  let result = codeBlocks
    .flatMap((block) => block.lines)
    .map((line) => {
      return INDENTATION_STRING.repeat(line.indentation) + line.lineContent;
    })
    .join(LINE_ENDING);

  return result;
}

  
const BLOCK_TYPE = {
  classDefinition: "classDefinition",
  classAttributesDefinition: "classAttributesDefinition",
  loopBody: "loopBody", // for, while
  loopHeader: "loopHeader", // for(i = 0;...) / while(i > 0)
  ifBody: "ifBody",
  ifHeader: "ifHeader", // if(i>0)
  switchBody: "switchBody",
  switchHeader: "switchHeader", // switch(...)
  defautPropertiesHeader: "defautPropertiesHeader", // switch(...)
  defautPropertiesBody: "defautPropertiesBody", // switch(...)
  openCurlyBraces: "openCurlyBraces", // switch(...)
  closeCurlyBraces: "closeCurlyBraces", // switch(...)
}

module.exports = {
  
  formatCode: function(input) {
    let formatters = [reducers.classDefinitionFormatting];
  
    const applyFunction = (x, f) => f(x);
  
    return formatters.reduce(applyFunction, input);
  }
}
