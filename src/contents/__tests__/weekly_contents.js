import WeeklyContents from '../weekly_contents';

describe('WeeklyContents', () => {

  describe('getMessage', () => {
    const wc = new WeeklyContents();
    const expected = /KEY__/;

    for (let d = 1; d < 31; d++) {
      const subject = new Date(2017, 11, d, 6, 0, 0);

      const hasMessages = wc.contents.find((c) => {
        return (
          c.reset_days.includes(subject.getDay()) ||
          c.reset_days.includes(new Date(subject.getTime() + 1000 * 60 * 60 * 24).getDay())
        );
      });

      test(`subject: ${subject}, hasMessages: ${hasMessages}`, () => {
        const msgs = wc.getMessage(subject);
        if (hasMessages) {
          msgs.forEach((msg) => {
            expect(msg.message).toEqual(expect.anything());
            expect(msg.message).not.toEqual(expected);
          })
        } else {
          expect(msgs.length).toBe(0);
        }
      });
    }
  })
});