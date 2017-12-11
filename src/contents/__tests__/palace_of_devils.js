import PalaceOfDevils from '../palace_of_devils';

const now = new Date();
const y = now.getFullYear() + 1;

const startDate = new PalaceOfDevils('').startDate;
const enemies = new PalaceOfDevils('').enemies;
const resetDays = new PalaceOfDevils('').resetDays;
const keywords = ['邪神', '邪心', 'じゃしん'];

describe('PalaceOfDevils', () => {
  describe.skip('elapsedEnemyIndex', () => {

  })

  describe('currentEnemyIndex', () => {
    const base = new PalaceOfDevils('', new Date(y, 0, resetDays[0], 6, 0, 0)).currentEnemyIndex();
    for (let i = 0; i < enemies.length; i++) {
      const subject = new Date(
        y,                                // year
        Math.floor(i / resetDays.length), // month
        resetDays[i % resetDays.length],  // day
        6, 0, 0);

      const expected = (base + i) % enemies.length;
      test(`on: ${subject} expected: ${base}`, () => {
        expect(new PalaceOfDevils('', subject).currentEnemyIndex()).toBe(expected);
      });

      const before = new Date(subject.getTime() - 1000);
      test(`Switching. subject: ${subject}, before: ${before}`, () => {
        expect(new PalaceOfDevils('', subject).currentEnemyIndex()).not.toBe(new PalaceOfDevils('', before).currentEnemyIndex());
//        console.log(`current: ${new PalaceOfDevils('', subject).currentEnemyIndex()} before:${new PalaceOfDevils('', before).currentEnemyIndex()}`);
      });
    }
  });

  describe.skip('nextEnemyIndex', () => {

  })

  describe('hasReply', () => {
    for (const keyword of keywords) {
      const pod = new PalaceOfDevils(keyword);
      test(`Check hook keyword: ${keyword}`, () => {
        expect(pod.hasReply()).toBeTruthy();
      });
    }
  });


  describe('getReply', () => {
    const expected = [
      expect.stringMatching(/KEY__/)
    ];

    for (let i = 0; i < enemies.length; i++) {
      const subject = new Date(
        y,
        Math.floor(i / resetDays.length),
        resetDays[i % resetDays.length],
        6, 0, 0
      );
      const pod = new PalaceOfDevils('邪神', subject);
      test(`Check length. ${subject}`, () => {
        expect(pod.getReply().message.length).toBeGreaterThan(0);
      });
      test(`Check no placeholders left. ${subject}`, () => {
          expect(pod.getReply().message).not.toEqual(expected);
      });
    }
  });
});
