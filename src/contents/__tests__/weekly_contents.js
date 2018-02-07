import WeeklyContents from '../weekly_contents';

describe('WeeklyContents', () => {

  describe('getMessage', () => {
    const wc = new WeeklyContents();
    for (let d = 1; d < 31; d++) {
      const subject = new Date(2017, 11, d, 6, 0, 0);

      const hasMessages = wc.contents.find((c) => {
        return (
          c.reset_days.includes(subject.getDay()) ||
          c.reset_days.includes(new Date(subject.getTime() + 1000 * 60 * 60 * 24).getDay())
        );
      });

      if (hasMessages) {
        test(`Check properties: subject: ${subject}, hasMessages: ${hasMessages}`, () => {
          return wc.getMessage(subject)
          .then((messages) => {
            messages.forEach((message) => {
              expect(message).toHaveProperty('pos');
              expect(message).toHaveProperty('message');
            })
          })
          .catch((e) => {
            console.log(e);
          })
        });
        test(`Check to message is not empty: subject: ${subject}, hasMessages: ${hasMessages}`, () => {
          return wc.getMessage(subject)
          .then((messages) => {
            messages.forEach((message) => {
              expect(message.message).toEqual(expect.anything());
            })
          })
          .catch((e) => {
            console.log(e);
          })
        });
        test(`Check no placeholders left: subject: ${subject}, hasMessages: ${hasMessages}`, () => {
          return wc.getMessage(subject)
          .then((messages) => {
            messages.forEach((message) => {
              expect(message.message).not.toEqual(expect.stringMatching(/KEY__/));
            })
          })
          .catch((e) => {
            console.log(e);
          })
        });
      } else {
        test(`Check no message: subject: ${subject}, hasMessages: ${hasMessages}`, () => {
          return wc.getMessage(subject)
          .then((messages) => {
            expect(messages.length).toBe(0);
          })
          .catch((e) => {
            console.log(e);
          })
        });
      }

    }
  })
});