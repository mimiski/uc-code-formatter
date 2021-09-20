const chai = require('chai')
const formatter = require('../formatter');
const classes = require("../classes");
const reducers = require("../reducers");
const fs = require('fs');

const filesDict = {
  classDefinition: {
    input: 'classDefinition.input.txt',
    expected_output: 'classDefinition.expected_output.txt'
  }
}

describe('Reducers', () => {
  it('classDefinition', () => {
        const input = fs.readFileSync('tests/misc/' + filesDict.classDefinition.input).toString();
        const expected_output = fs.readFileSync('tests/misc/' + filesDict.classDefinition.expected_output).toString();
        result = reducers.classDefinition(input);
        chai.expect(result).to.equal(expected_output)
      });
    })
//       it('refactor for loops that have no curly braces', () => {
//           const input = `
// for(i = 0; i < 5; i++)
// a();`;
//           const expected_output = `
// for(i = 0; i < 5; i++)
// {
//     a();
// }`
//           result = formatter.formatCode(input);
//           expect(result).to.equal(expected_output)
//         });
//   })