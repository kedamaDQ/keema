import Foresdon from '../foresdon_utils';

describe('Foresdon', () => {

  const foresdon = new Foresdon();

  describe('getMonster', () => {
    for (let i = 0; i < 150; i++) {
      test(`Re-fetch if monsters stock is empty.`, () => {
        return foresdon.getMonster()
        .then((monster) => {
          expect(monster).toEqual(expect.anything());
        })
      })
    }
  })
});