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
});
