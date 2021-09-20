const chai = require('chai')
const expect = chai.expect
const formatter = require('../formatter');

describe('Formatter', () => {
  describe('Class definition', () => {
    it('indent dependson', () => {
        const input = `
class Asdf extends Xyz
dependson(Qwerty);
        `;
        const expected_output = `
class Asdf extends Xyz
    dependson(Qwerty);
        `
        result = formatter.formatCode(input);
        expect(result).to.equal(expected_output)
      })
  })
})