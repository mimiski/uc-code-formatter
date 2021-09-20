const chai = require('chai')
const formatter = require('../formatter');
const classes = require("../classes");
const reducers = require("../reducers");

describe('Reducers', () => {
  it('classDefinition', () => {
        const input = `class Asdf extends Xyz
dependson(Qwerty);`;
        const expected_output = `class Asdf extends Xyz
    dependson(Qwerty);`
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