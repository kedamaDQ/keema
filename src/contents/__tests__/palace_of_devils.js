import PalaceOfDevils from '../palace_of_devils';

describe('PalaceOfDevils', () => {
  describe.skip('elapsedEnemyIndex', () => {

  })
  describe('currentEnemyIndex', () => {
    test('6 hours offsetted.', () => {
      const pod1 = new PalaceOfDevils(new Date(2017, 11, 9, 0, 0, 0));    // 2017-12-09T00:00:00
      const pod2 = new PalaceOfDevils(new Date(2017, 11, 10, 5, 59, 59)); // 2017-12-10T05:59:59
      const pod3 = new PalaceOfDevils(new Date(2017, 11, 10, 6, 0, 0));   // 2017-12-10T06:00:00
      expect(pod1.currentEnemyIndex()).toBe(pod2.currentEnemyIndex());
      expect(pod1.currentEnemyIndex()).not.toBe(pod3.currentEnemyIndex());
    })
    test('6 hours offsetted.', () => {
      const pod1 = new PalaceOfDevils(new Date(2017, 11, 24, 0, 0, 0));   // 2017-12-24T00:00:00
      const pod2 = new PalaceOfDevils(new Date(2017, 11, 25, 5, 59, 59)); // 2017-12-25T05:59:59
      const pod3 = new PalaceOfDevils(new Date(2017, 11, 25, 6, 0, 0));   // 2017-12-25T06:00:00
      expect(pod1.currentEnemyIndex()).toBe(pod2.currentEnemyIndex());
      expect(pod1.currentEnemyIndex()).not.toBe(pod3.currentEnemyIndex());
    })
  })
  describe('nextEnemyIndex', () => {

  })
  describe('getMessage', () => {
    const pod1 = new PalaceOfDevils(new Date(2017, 11, 8, 0, 0, 0));
    const pod2 = new PalaceOfDevils(new Date(2017, 11, 9, 0, 0, 0));
    const pod3 = new PalaceOfDevils(new Date(2017, 11, 10, 6, 0, 0));
    const pod4 = new PalaceOfDevils(new Date(2017, 11, 11, 6, 0, 0));
    expect(pod1.getMessage().length > 0).toBeTruthy();
    expect(pod2.getMessage().length > 0).toBeTruthy();
    expect(pod3.getMessage().length > 0).toBeTruthy();
    expect(pod4.getMessage().length > 0).toBeTruthy();
  })
  describe('getFullMessage', () => {
    const pod1 = new PalaceOfDevils();
    expect(pod1.getMessage().length > 0).toBeTruthy();
  })
});
