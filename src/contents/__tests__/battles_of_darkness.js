import BattlesOfDarkness from '../battles_of_darkness';
import {
  MINUTE,
  HOUR,
  DAY
} from '../../utils/date_utils';

describe('BattlesOfDarkness', () => {
  const startDate = new BattlesOfDarkness('').startDate;
  const levelNumbers = new BattlesOfDarkness('').levelNumbers.slice(0);
  const enemiesLength = new BattlesOfDarkness('').enemies.length;
  const keywords = ['レグ', 'DK', 'イカ', '常闇'];

  describe('getLevel', () => {
    const bod = new BattlesOfDarkness();
    for (let i = 0; i < 366; i++) {

      const d0000 = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i, 0, 0, 0);
      for (let offset = 0; offset < enemiesLength; offset++) {
        test(`enemies: ${enemiesLength}, day: ${i}, offset:${offset} ${d0000}`, () => {
          expect(bod.getLevel(bod.offsetTime(d0000), offset)).toBe(levelNumbers[(i + offset - 1) % levelNumbers.length]);
        });
      }

      const d0559 = new Date(d0000.getTime() + 5 * HOUR + 59 * MINUTE);
      for (let offset = 0; offset < enemiesLength; offset++) {
        test(`enemies: ${enemiesLength}, day: ${i}, offset:${offset} at ${d0559}`, () => {
          expect(bod.getLevel(bod.offsetTime(d0559), offset)).toBe(levelNumbers[(i + offset - 1) % levelNumbers.length]);
        });
      }

      const d0600 = new Date(d0000.getTime() + 6 * HOUR);
      for (let offset = 0; offset < enemiesLength; offset++) {
        test(`enemies: ${enemiesLength}, day: ${i}, offset:${offset} at ${d0600}`, () => {
          expect(bod.getLevel(bod.offsetTime(d0600), offset)).toBe(levelNumbers[(i + offset) % levelNumbers.length]);
        });
      }
    }
  });

  describe('hasReply', () => {
    for (const keyword of keywords) {
      const bod = new BattlesOfDarkness();
      test(`Check hook keyword: ${keyword}`, () => {
        expect(bod.hasReply(keyword)).toBeTruthy();
      });
    }
  });

  describe('getReply', () => {
    const bod = new BattlesOfDarkness();
    for (const keyword of keywords) {
      test(`Check properties: ${keyword}`, () => {
        return bod.getReply(keyword)
        .then((replies) => {
          replies.forEach((reply) => {
            expect(reply).toHaveProperty('pos');
            expect(reply).toHaveProperty('message');
          })
        })
        .catch((e) => {
          console.log(e);
        });
      });
      test(`Check any value: ${keyword}`, () => {
        return bod.getReply(keyword)
        .then((replies) => {
          replies.forEach((reply) => {
            expect(reply.message).toEqual(expect.anything());
          });
        })
        .catch((e) => {
          console.log(e);
        });
      });
      test(`Check no placeholders left: ${keyword}`, () => {
        return bod.getReply(keyword)
        .then((replies) => {
          replies.forEach((reply) => {
            expect(reply.message).not.toEqual(expect.stringMatching(/KEY__/));
          })
        })
        .catch((e) => {
          console.log(e);
        });
      });
    }
  });

  describe('getMessage', () => {
    const y = new Date(Date.now()).getFullYear() + 1;
    const bod = new BattlesOfDarkness();

    for (let m = 0; m < 12; m++) {
      for (let d = 1; d < 31; d++) {
        const subject = new Date(y, m, d, 6, 0, 0);

        test(`Check properties: ${subject}`, () => {
          return bod.getMessage(subject)
          .then((messages) => {
            messages.forEach((message) => {
              expect(message).toHaveProperty('pos');
              expect(message).toHaveProperty('message');
            });
          })
          .catch((e) => {
            console.log(e);
          })
        });
        test(`Check to message not empty: ${subject}`, () => {
          return bod.getMessage(subject)
          .then((messages) => {
            messages.forEach((message) => {
              expect(message.message).toEqual(expect.anything());
            });
          })
          .catch((e) =>  {
            console.log(e);
          });
        });
        test(`Check no placeholder left: ${subject}`, () => {
          return bod.getMessage(subject)
          .then((messages) => {
            messages.forEach((message) => {
              expect(message.message).not.toEqual(expect.stringMatching(/KEY__/));
            });
          })
          .catch((e) => {
            console.log(e);
          });
        });
      }
    }
  })
});
