import DefenceArmy from '../defence_army';
import {
  MIN,
  HOUR,
  DAY
} from '../../utils/date_utils';

describe('DefenceArmy', () => {

  describe('getMessage', () => {
    const expected = [
      expect.stringMatching(/KEY__/)
    ]

    const da = new DefenceArmy('');
    test('getMessage', () => {
      expect(da.getMessage().length).toBeGreaterThan(0);
      expect(da.getMessage()).not.toEqual(expected);
    })
  });
})
