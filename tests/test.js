const chai = require("chai");
const formatter = require("../src/formatter");
const classes = require("../src/classes");
const reducers = require("../src/reducers");
const utils = require("../src/utils");

const fs = require("fs");

const filesDict = {
  classDefinition: {
    input: ["1.input.txt", "2.input.txt"],
    expected_output: ["1.expected_output.txt", "2.expected_output.txt"],
  },
  repeatedNewlineFormatting: {
    input: "repeatedNewlineFormatting.input.txt",
    expected_output: "repeatedNewlineFormatting.expected_output.txt",
  },
  loopHeaderFormatting: {
    input: ["1.input.txt", "2.input.txt"],
    expected_output: ["1.expected_output.txt", "2.expected_output.txt"],
  },
  forLoopOneLiner: {
    input: ["1.input.txt", "2.input.txt", "3.input.txt"],
  },
  whileLoopOneLiner: {
    input: ["1.input.txt", "2.input.txt", "3.input.txt"],
  },
  ifOneLiner: {
    input: ["1.input.txt", "2.input.txt", "3.input.txt"],
  },
  curlyBracesLineSplitting: {
    input: ["1.input.txt", "2.input.txt", "3.input.txt"],
    expected_output: [
      "1.expected_output.txt",
      "2.expected_output.txt",
      "3.expected_output.txt",
    ],
  },
  lineIndentationSimple: {
    input: ["simple.1.input.txt", "simple.2.input.txt", "simple.3.input.txt"],
    expected_output: "simple.expected_output.txt",
  },

  lineIndentationHierarchical: {
    input: ["hierarchical.2.input.txt", "hierarchical.1.input.txt", "hierarchical.3.input.txt"],
    expected_output: "hierarchical.expected_output.txt",
  },

  e2e: {
    input: ["1.input.txt", "2.input.txt", "3.input.txt"],
    expected_output: ["1.expected_output.txt", "2.expected_output.txt", "3.expected_output.txt"],
  },
};

describe("Reducers", () => {
  it("classDefinition indentation", () => {
    const input = fs
      .readFileSync(
        "tests/misc/classDefinition/" + filesDict.classDefinition.input[0]
      )
      .toString();
    const expected_output = fs
      .readFileSync(
        "tests/misc/classDefinition/" +
          filesDict.classDefinition.expected_output[0]
      )
      .toString();
    const pipeline = [
      reducers.classDefinitionFormatting,
      reducers.repeatedNewlineFormatting,
    ];

    result = pipeline.reduce(utils.applyReducer, input);
    chai.expect(result).to.equal(expected_output);
  });

  it("classDefinition with vars below", () => {
    const input = fs
      .readFileSync(
        "tests/misc/classDefinition/" + filesDict.classDefinition.input[1]
      )
      .toString();
    const expected_output = fs
      .readFileSync(
        "tests/misc/classDefinition/" +
          filesDict.classDefinition.expected_output[1]
      )
      .toString();
    const pipeline = [
      reducers.classDefinitionFormatting,
      reducers.repeatedNewlineFormatting,
    ];

    result = pipeline.reduce(utils.applyReducer, input);
    chai.expect(result).to.equal(expected_output);
  });

  it("repeatedNewlineFormatting", () => {
    const input = fs
      .readFileSync("tests/misc/" + filesDict.repeatedNewlineFormatting.input)
      .toString();
    const expected_output = fs
      .readFileSync(
        "tests/misc/" + filesDict.repeatedNewlineFormatting.expected_output
      )
      .toString();
    result = reducers.repeatedNewlineFormatting(input);
    chai.expect(result).to.equal(expected_output);
  });

  it("loopHeaderFormatting - all entries present", () => {
    const inputs_1 = [
      "for( i=   0;    i   <  1;     i++   )",
      "for(i=0;i<1;i++)",
      "for (i=0;i<1;i++)",
      "for( i=0;i<1;i++)",
      "for(i =0;i<1;i++)",
      "for(i= 0;i<1;i++)",
      "for(i=0 ;i<1;i++)",
      "for(i=0; i<1;i++)",
      "for(i=0;i <1;i++)",
      "for(i=0;i< 1;i++)",
      "for(i=0;i<1 ;i++)",
      "for(i=0;i<1; i++)",
      "for(i=0;i<1;i++ )",
    ];
    const expected_output_1 = "for (i = 0; i < 1; i++)";
    inputs_1.forEach((input) => {
      result = reducers.loopHeaderFormatting(input);
      chai.expect(result).to.equal(expected_output_1);
    });
  });

  it("loopHeaderFormatting - first entry absent", () => {
    const inputs_2 = ["for(;i<1;i++ )", "for( ;i<1;i++ )", "for(   ;i<1;i++ )"];
    const expected_output_2 = "for ( ; i < 1; i++)";
    inputs_2.forEach((input) => {
      result = reducers.loopHeaderFormatting(input);
      chai.expect(result).to.equal(expected_output_2);
    });
  });

  it("loopHeaderFormatting - second entry absent", () => {
    const inputs_3 = [
      "for (i = 0;; i++)",
      "for (i = 0; ; i++)",
      "for (i = 0;  ; i++)",
      "for (i = 0;       ; i++)",
    ];
    const expected_output_3 = "for (i = 0; ; i++)";
    inputs_3.forEach((input) => {
      result = reducers.loopHeaderFormatting(input);
      chai.expect(result).to.equal(expected_output_3);
    });
  });

  it("loopHeaderFormatting - second entry flag", () => {
    const inputs_3 = [
      "for (i = 0;bFlag; i++)",
      "for (i = 0;bFlag ; i++)",
      "for (i = 0; bFlag; i++)",
      "for (i = 0; bFlag ; i++)",
      "for (i = 0;    bFlag  ; i++)",
    ];
    const expected_output_3 = "for (i = 0; bFlag; i++)";
    inputs_3.forEach((input) => {
      result = reducers.loopHeaderFormatting(input);
      chai.expect(result).to.equal(expected_output_3);
    });
  });

  it("loopHeaderFormatting - third entry absent", () => {
    const inputs_3 = [
      "for (i = 0; i < 5;)",
      "for (i = 0; i < 5; )",
      "for (i = 0; i < 5;  )",
      "for (i = 0; i < 5;       )",
    ];
    const expected_output_3 = "for (i = 0; i < 5; )";
    inputs_3.forEach((input) => {
      result = reducers.loopHeaderFormatting(input);
      chai.expect(result).to.equal(expected_output_3);
    });
  });

  it("ifHeaderFormatting", () => {
    const inputs = ["if(bFlag)", "if (bFlag)", "if( bFlag)", "if(bFlag )"];
    const expected_output = "if (bFlag)";
    inputs.forEach((input) => {
      result = reducers.ifHeaderFormatting(input);
      chai.expect(result).to.equal(expected_output);
    });
  });

  it("switchHeaderFormatting", () => {
    const inputs = [
      "switch(bFlag)",
      "switch (bFlag)",
      "switch( bFlag)",
      "switch(bFlag )",
    ];
    const expected_output = "switch (bFlag)";
    inputs.forEach((input) => {
      result = reducers.switchHeaderFormatting(input);
      chai.expect(result).to.equal(expected_output);
    });
  });

  it("forLoopOneLiner", () => {
    filesDict.forLoopOneLiner.input.forEach((fileName) => {
      const input = fs
        .readFileSync("tests/misc/forLoopOneLiner/" + fileName)
        .toString();
      result = reducers.forLoopOneLiner(input);
      chai
        .expect(result)
        .to.match(new RegExp("for[ |\t]*(.+)[ |\t]*{((.|\n|\r)*)"));
    });
  });

  it("whileLoopOneLiner", () => {
    filesDict.whileLoopOneLiner.input.forEach((fileName) => {
      const input = fs
        .readFileSync("tests/misc/whileLoopOneLiner/" + fileName)
        .toString();
      result = reducers.whileLoopOneLiner(input);
      chai
        .expect(result)
        .to.match(new RegExp("while[ |\t]*(.+)[ |\t]*{((.|\n|\r)*)"));
    });
  });

  it("ifOneLiner", () => {
    filesDict.ifOneLiner.input.forEach((fileName) => {
      const input = fs
        .readFileSync("tests/misc/ifOneLiner/" + fileName)
        .toString();
      result = reducers.ifOneLiner(input);
      chai
        .expect(result)
        .to.match(new RegExp("if[ |\t]*(.+)[ |\t]*{((.|\n|\r)*)"));
    });
  });

  it("curlyBracesLineSplitting", () => {
    filesDict.curlyBracesLineSplitting.input.forEach((inputFileName) => {
      const input = fs
        .readFileSync("tests/misc/curlyBracesLineSplitting/" + inputFileName)
        .toString();
      result = reducers.curlyBracesLineSplitting(input).split("\r\n");
      const expectedOutput1 = new RegExp(/[\S]+.*?\{/);
      const expectedOutput2 = new RegExp(/\{.*?[\S]+/);
      const expectedOutput3 = new RegExp(/[\S]+.*?\}/);
      const expectedOutput4 = new RegExp(/\}.*?[\S]+/);
      result.forEach((line) => {
        chai.expect(line).to.not.match(expectedOutput1);
        chai.expect(line).to.not.match(expectedOutput2);
        chai.expect(line).to.not.match(expectedOutput3);
        chai.expect(line).to.not.match(expectedOutput4);
      });
    });
  });

  it("lineIndentation simple", () => {
    const inputs = filesDict.lineIndentationSimple.input.map((fileName) => {
      return fs
        .readFileSync("tests/misc/lineIndentation/" + fileName)
        .toString();
    });
    const expected_output = fs
      .readFileSync(
        "tests/misc/lineIndentation/" +
          filesDict.lineIndentationSimple.expected_output
      )
      .toString();
    inputs.forEach((input) => {
      result = reducers.lineIndentation(input);
      chai.expect(result).to.equal(expected_output);
    });
  });

  it("lineIndentation hierarchical", () => {
    const inputs = filesDict.lineIndentationHierarchical.input.map((fileName) => {
      return fs
        .readFileSync("tests/misc/lineIndentation/" + fileName)
        .toString();
    });
    const expected_output = fs
      .readFileSync(
        "tests/misc/lineIndentation/" +
          filesDict.lineIndentationHierarchical.expected_output
      )
      .toString();
    inputs.forEach((input) => {
      result = reducers.lineIndentation(input);
      chai.expect(result).to.equal(expected_output);
    });
  });

  it("defaultpropertiesIndentation", () => {
    const input = fs
      .readFileSync("tests/misc/defaultproperties/indentation.input.txt")
      .toString();
    const expected_output = fs
      .readFileSync(
        "tests/misc/defaultproperties/indentation.expected_output.txt"
      )
      .toString();
    result = reducers.lineIndentation(input);
    chai.expect(result).to.equal(expected_output);
  });

  it("forLoopOneLinerWithIndentation", () => {
    const input = "for (i = 0; i < 5; i++) a();";
    const expected_output = fs
      .readFileSync(
        "tests/misc/forLoopOneLiner/forLoopOneLineIndentation.expected_output.txt"
      )
      .toString();
    const pipeline = [
      reducers.forLoopOneLiner,
      reducers.curlyBracesLineSplitting,
      reducers.lineIndentation,
    ];

    result = pipeline.reduce(utils.applyReducer, input);
    chai.expect(result).to.equal(expected_output);
  });
});

describe("Formatter", () => {
  it("e2e simple", () => {
    const input = fs
      .readFileSync("tests/misc/e2e/" + filesDict.e2e.input[0])
      .toString();
    const y = fs
      .readFileSync("tests/misc/e2e/" + filesDict.e2e.expected_output[0])
      .toString();
    const x = formatter.formatCode(input);
    chai.expect(x).to.equal(y);
  });

  it("e2e with hierarchical code blocks", () => {
    const input = fs
      .readFileSync("tests/misc/e2e/" + filesDict.e2e.input[2])
      .toString();
    const y = fs
      .readFileSync("tests/misc/e2e/" + filesDict.e2e.expected_output[2])
      .toString();
    const x = formatter.formatCode(input);
    chai.expect(x).to.equal(y);
  });

  it("whitespaces", () => {
    const input = fs
      .readFileSync("tests/misc/e2e/" + filesDict.e2e.input[1])
      .toString();
    const expected_output = fs
      .readFileSync("tests/misc/e2e/" + filesDict.e2e.expected_output[1])
      .toString();
    result = formatter.formatCode(input);
    chai.expect(result).to.equal(expected_output);
  });
});
