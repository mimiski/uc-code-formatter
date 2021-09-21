module.exports = {

  CodeBlock: class {
    constructor(lines, type, content) {
      this.lines = lines;
      this.type = type;
      this.content = content;
    }
  },

  Line: class {
    constructor(indentation, lineContent) {
      this.indentation = indentation;
      this.lineContent = lineContent;
    }
  },

  ContentBlock: class {
    constructor(indentation, blockStart, blockEnd) {
      this.indentation = indentation;
      this.blockStart = blockStart;
      this.blockEnd = blockEnd;
    }
  },
};
