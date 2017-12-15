import Foresdon from '../foresdon_utils';

describe('Foresdon', () => {

  const foresdon = new Foresdon();

  describe('getMonster', () => {
    const length = foresdon.json.monsters.length;

    for (let i = 0; i < length * 2; i++) {
      test(`get ${i + 1} of ${length} monsters.`, () => {
        expect(foresdon.getMonster()).toEqual(expect.anything());
      })
    }
  })
});