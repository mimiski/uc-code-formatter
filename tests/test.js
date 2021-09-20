const chai = require('chai')
const formatter = require('../src/formatter');
const classes = require("../src/classes");
const reducers = require("../src/reducers");
const utils = require("../src/utils");

const fs = require('fs');

const filesDict = {
  classDefinition: {
    input: 'classDefinition.input.txt',
    expected_output: 'classDefinition.expected_output.txt'
  },
  repeatedNewlineFormatting: {
    input: 'repeatedNewlineFormatting.input.txt',
    expected_output: 'repeatedNewlineFormatting.expected_output.txt'
  },
  loopHeaderFormatting: {
    input: ['1.input.txt', '2.input.txt'],
    expected_output: ['1.expected_output.txt', '2.expected_output.txt']
  },
}

describe('Reducers', () => {
  it('classDefinition', () => {
        const input = fs.readFileSync('tests/misc/' + filesDict.classDefinition.input).toString();
        const expected_output = fs.readFileSync('tests/misc/' + filesDict.classDefinition.expected_output).toString();
        result = reducers.classDefinitionFormatting(input);
        chai.expect(result).to.equal(expected_output)
    }
  );

  it('repeatedNewlineFormatting', () => {
    const input = fs.readFileSync('tests/misc/' + filesDict.repeatedNewlineFormatting.input).toString();
    const expected_output = fs.readFileSync('tests/misc/' + filesDict.repeatedNewlineFormatting.expected_output).toString();
    result = reducers.repeatedNewlineFormatting(input);
    chai.expect(result).to.equal(expected_output)
    }
  );

  it('loopHeaderFormatting', () => {
    tests = utils.zip(filesDict.loopHeaderFormatting.input, filesDict.loopHeaderFormatting.expected_output)
    tests.forEach(([input_file_name, expected_output_file_name]) => {
      const input = fs.readFileSync('tests/misc/loopHeaderFormatting/' + input_file_name).toString();
      const expected_output = fs.readFileSync('tests/misc/loopHeaderFormatting/' + expected_output_file_name).toString();
      result = reducers.loopHeaderFormatting(input);
      chai.expect(result).to.equal(expected_output);
    })
    }
  );
})