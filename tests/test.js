const chai = require("chai");
const formatter = require("../src/formatter");
const reducers = require("../src/reducers");
const utils = require("../src/utils");

const fs = require("fs");

function executeTest(testName, f, config) {
  const input = config[testName].input.map((fileName) =>
    fs.readFileSync("tests/misc/" + testName + "/" + fileName).toString()
  );
  const expected_output = config[testName].expected_output.map((fileName) =>
    fs.readFileSync("tests/misc/" + testName + "/" + fileName).toString()
  );

  const tests = utils.zip(input, expected_output);

  tests.forEach(([input, expected_output]) => {
    const result = f(input);
    chai.expect(result).to.equal(expected_output);
  });
}

const filesDict = {
  classDefinition: {
    input: ["1.input.txt", "2.input.txt"],
    expected_output: ["1.expected_output.txt", "2.expected_output.txt"],
  },
  repeatedNewlineFormatting: {
    input: ["1.input.txt", "2.input.txt"],
    expected_output: ["1.expected_output.txt", "2.expected_output.txt"],
  },
  forLoopHeaderFormatting: {
    input: ["1.input.txt", "2.input.txt"],
    expected_output: ["1.expected_output.txt", "2.expected_output.txt"],
  },

  lineIndentationSimple: {
    input: ["simple.1.input.txt", "simple.2.input.txt", "simple.3.input.txt"],
    expected_output: "simple.expected_output.txt",
  },

  ifMultilineHeaderAlignment: {
    input: ["1.input.txt", "2.input.txt"],
    expected_output: ["1.expected_output.txt", "2.expected_output.txt"],
  },

  lineIndentationHierarchical: {
    input: [
      "hierarchical.1.input.txt",
    ],
    expected_output: "hierarchical.expected_output.txt",
  },

  e2e: {
    input: [
      "1.input.txt",
      "2.input.txt",
      "3.input.txt",
      "4.input.txt",
      "5.input.txt",
      "6.input.txt",
    ],
    expected_output: [
      "1.expected_output.txt",
      "2.expected_output.txt",
      "3.expected_output.txt",
      "4.expected_output.txt",
      "5.expected_output.txt",
      "6.expected_output.txt",
    ],
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

    const result = utils.runPipeline(pipeline, input);
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

    const result = utils.runPipeline(pipeline, input);
    chai.expect(result).to.equal(expected_output);
  });

  it("repeatedNewlineFormatting", () => {
    executeTest(
      "repeatedNewlineFormatting",
      reducers.repeatedNewlineFormatting,
      filesDict
    );
  });

  it("forLoopHeaderFormatting - all entries present", () => {
    const inputs_1 = [
      "for(i=0;i<1;i++)",
      "for (i=0;i<1;i++)",
      "for   (i=0;i<1;i++)",
    ];
    const expected_output_1 = "for (i=0;i<1;i++)";
    inputs_1.forEach((input) => {
      const result = reducers.forLoopHeaderFormatting(input);
      chai.expect(result).to.equal(expected_output_1);
    });
  });

  it("whileLoopHeaderFormatting - space between while and parentheses", () => {
    const inputs = ["while(i < 5)", "while  (i < 5)", "while      (i < 5)"];
    const expected_output = "while (i < 5)";
    inputs.forEach((input) => {
      const result = reducers.whileLoopHeader(input);
      chai.expect(result).to.equal(expected_output);
    });
  });

  it("ifHeaderFormatting - flag", () => {
    const inputs = [
      "if (bFlag)",
      "if   (bFlag)",
      "if(bFlag)",
      "if        (bFlag)",
    ];
    const expected_output = "if (bFlag)";
    inputs.forEach((input) => {
      const result = reducers.ifHeaderFormatting(input);
      chai.expect(result).to.equal(expected_output);
    });
  });

  it("ifHeaderFormatting - expr op expr", () => {
    const inputs = [
      "if (i < 5){",
      "if   (i < 5){",
      "if(i < 5){",
      "if        (i < 5){",
    ];
    const expected_output = "if (i < 5){";
    inputs.forEach((input) => {
      const result = reducers.ifHeaderFormatting(input);
      chai.expect(result).to.equal(expected_output);
    });
  });

  it("switchHeaderFormatting", () => {
    const inputs = [
      "switch(bFlag)",
      "switch (bFlag)",
      "switch   (bFlag)",
      "switch       (bFlag)",
    ];
    const expected_output = "switch (bFlag)";
    inputs.forEach((input) => {
      const result = reducers.switchHeaderFormatting(input);
      chai.expect(result).to.equal(expected_output);
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
      const result = reducers.lineIndentation(input);
      chai.expect(result).to.equal(expected_output);
    });
  });

  it("ifMultilineHeaderAlignment", () => {
    const inputs = filesDict.ifMultilineHeaderAlignment.input.map(
      (fileName) => {
        return fs
          .readFileSync("tests/misc/ifMultilineHeaderAlignment/" + fileName)
          .toString();
      }
    );
    const expected_outputs =
      filesDict.ifMultilineHeaderAlignment.expected_output.map((fileName) =>
        fs
          .readFileSync("tests/misc/ifMultilineHeaderAlignment/" + fileName)
          .toString()
      );

    const tests = utils.zip(inputs, expected_outputs);

    tests.forEach(([input, expected_output]) => {
      const result = reducers.ifMultilineHeaderAlignment(input);
      chai.expect(result).to.equal(expected_output);
    });
  });

  it("lineIndentation hierarchical", () => {
    const inputs = filesDict.lineIndentationHierarchical.input.map(
      (fileName) => {
        return fs
          .readFileSync("tests/misc/lineIndentation/" + fileName)
          .toString();
      }
    );
    const expected_output = fs
      .readFileSync(
        "tests/misc/lineIndentation/" +
          filesDict.lineIndentationHierarchical.expected_output
      )
      .toString();
    inputs.forEach((input) => {
      const result = reducers.lineIndentation(input);
      chai.expect(result).to.equal(expected_output);
    });
  });

  it("lineIndentation string variable with braces inside", () => {
    const input = fs
      .readFileSync(
        "tests/misc/lineIndentation/curly_braces_vs_comments.input.txt"
      )
      .toString();
    const expected_output = fs
      .readFileSync(
        "tests/misc/lineIndentation/curly_braces_vs_comments.expected_output.txt"
      )
      .toString();
    const result = reducers.lineIndentation(input);
    chai.expect(result).to.equal(expected_output);
  });

  it("lineIndentation curly braces in comments", () => {
    const input = "// {0} {1}";
    const expected_output = "// {0} {1}";
    const result = reducers.lineIndentation(input);
    chai.expect(result).to.equal(expected_output);
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
    const result = reducers.lineIndentation(input);
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
    const result = formatter.formatCode(input);
    chai.expect(result).to.equal(expected_output);
  });

  it("multiline condition alignment", () => {
    const input = fs
      .readFileSync("tests/misc/e2e/" + filesDict.e2e.input[3])
      .toString();
    const y = fs
      .readFileSync("tests/misc/e2e/" + filesDict.e2e.expected_output[3])
      .toString();
    const x = formatter.formatCode(input);
    chai.expect(x).to.equal(y);
  });

  it("two functions", () => {
    const input = fs
      .readFileSync("tests/misc/e2e/" + filesDict.e2e.input[4])
      .toString();
    const y = fs
      .readFileSync("tests/misc/e2e/" + filesDict.e2e.expected_output[4])
      .toString();
    const x = formatter.formatCode(input);
    chai.expect(x).to.equal(y);
  });

  it("new lines", () => {
    const input = fs
      .readFileSync("tests/misc/e2e/" + filesDict.e2e.input[5])
      .toString();
    const y = fs
      .readFileSync("tests/misc/e2e/" + filesDict.e2e.expected_output[5])
      .toString();
    const x = formatter.formatCode(input);
    chai.expect(x).to.equal(y);
  });
});
