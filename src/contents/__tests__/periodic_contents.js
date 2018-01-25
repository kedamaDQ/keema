import PeriodicContents from '../periodic_contents';

describe('PeriodicContents', () => {
  describe('getMessage', () => {
    const pc = new PeriodicContents();
    const expected = /KEY__/;

    for (let d = 1; d < 100; d++) {
      const subject = new Date(2018, 0, d, 6, 0, 0);

      const hasMessages = pc.messageProps.periodic.find((c) => {
        return (
          c.reset_days.includes(subject.getDate()) ||
          c.reset_days.includes(new Date(subject.getTime() + 1000 * 60 * 60 * 24).getDate())
        );
      });

      test(`subject: ${subject}, hasMessages: ${hasMessages}`, () => {
        const msgs = pc.getMessage(subject);
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
  });
});
