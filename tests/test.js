const chai = require("chai");
const formatter = require("../src/formatter");
const classes = require("../src/classes");
const reducers = require("../src/reducers");
const utils = require("../src/utils");

const fs = require("fs");

const filesDict = {
  classDefinition: {
    input: "classDefinition.input.txt",
    expected_output: "classDefinition.expected_output.txt",
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
};

describe("Reducers", () => {
  it("classDefinition", () => {
    const input = fs
      .readFileSync("tests/misc/" + filesDict.classDefinition.input)
      .toString();
    const expected_output = fs
      .readFileSync("tests/misc/" + filesDict.classDefinition.expected_output)
      .toString();
    result = reducers.classDefinitionFormatting(input);
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
      const input = fs.readFileSync("tests/misc/forLoopOneLiner/" + fileName).toString();
      result = reducers.forLoopOneLiner(input);
      chai
        .expect(result)
        .to.match(new RegExp("for[ |\t]*\(.+\)[ |\t]*\{((.|\n|\r)*)"));
    });
  });

  it("whileLoopOneLiner", () => {
    filesDict.whileLoopOneLiner.input.forEach((fileName) => {
      const input = fs.readFileSync("tests/misc/whileLoopOneLiner/" + fileName).toString();
      result = reducers.whileLoopOneLiner(input);
      chai
        .expect(result)
        .to.match(new RegExp("while[ |\t]*\(.+\)[ |\t]*\{((.|\n|\r)*)"));
    });
  });
});
