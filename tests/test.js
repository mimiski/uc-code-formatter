const chai = require('chai')
const formatter = require('../formatter');
const classes = require("../classes");
const reducers = require("../reducers");
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
})