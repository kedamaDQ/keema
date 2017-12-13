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

  describe('getEnemyIndex', () => {
    const pod = new PalaceOfDevils();
    const base = pod.getEnemyIndex(new Date(y, 0, resetDays[0], 6, 0, 0));
    for (let i = 0; i < enemies.length; i++) {
      const subject = new Date(
        y,                                // year
        Math.floor(i / resetDays.length), // month
        resetDays[i % resetDays.length],  // day
        6, 0, 0);

      const expected = (base + i) % enemies.length;
      test(`on: ${subject} expected: ${expected}`, () => {
        expect(pod.getEnemyIndex(subject)).toBe(expected);
      });

      const before = new Date(subject.getTime() - 1000);
      test(`Switching. subject: ${subject}, before: ${before}`, () => {
        expect(pod.getEnemyIndex(subject)).not.toBe(pod.getEnemyIndex(before));
      });
    }
  });

  describe.skip('getNextEnemyIndex', () => {

  })

  describe('hasReply', () => {
      const pod = new PalaceOfDevils();
    for (const keyword of keywords) {
      test(`Check hook keyword: ${keyword}`, () => {
        expect(pod.hasReply(keyword)).toBeTruthy();
      });
    }
  });


  describe('getReply', () => {
    const expected = [
      expect.stringMatching(/KEY__/)
    ];
    const pod = new PalaceOfDevils();

    for (let i = 0; i < enemies.length; i++) {
      const subject = new Date(
        y,
        Math.floor(i / resetDays.length),
        resetDays[i % resetDays.length],
        6, 0, 0
      );

      for (const keyword of keywords) {
        test(`Check length. keyword:${keyword}, subject:${subject}`, () => {
          expect(pod.getReply(keyword,subject).message.length).toBeGreaterThan(0);
        });
        test(`Check no placeholders left. keyword: ${keyword}, subject:${subject}`, () => {
            expect(pod.getReply(keyword, subject).message).not.toEqual(expected);
        });
      }
    }
  });
});
