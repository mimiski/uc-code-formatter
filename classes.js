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
};
