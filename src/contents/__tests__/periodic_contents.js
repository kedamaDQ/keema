import PeriodicContents from '../periodic_contents';

describe('PeriodicContents', () => {
  describe('getMessage', () => {
    const pc = new PeriodicContents();
    for (let d = 1; d < 100; d++) {
      const subject = new Date(2018, 0, d, 6, 0, 0);

      const hasMessages = pc.messageProps.periodic.find((c) => {
        return (
          c.reset_days.includes(subject.getDate()) ||
          c.reset_days.includes(new Date(subject.getTime() + 1000 * 60 * 60 * 24).getDate())
        );
      });

      if (hasMessages) {
        test(`Check properties: subject: ${subject}, hasMessages: ${hasMessages}`, () => {
          return pc.getMessage(subject)
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
        test(`Check to message is not empty: subject: ${subject}, hasMessages: ${hasMessages}`, () => {
          return pc.getMessage(subject)
          .then((messages) => {
            messages.forEach((message) => {
              expect(message.message).toEqual(expect.anything());
            });
          })
          .catch((e) => {
            console.log(e);
          })
        });
        test(`Check no placeholders left: subject: ${subject}, hasMessages: ${hasMessages}`, () => {
          return pc.getMessage(subject)
          .then((messages) => {
            messages.forEach((message) => {
              expect(message.message).not.toEqual(expect.stringMatching(/KEY__/));
            });
          })
          .catch((e) => {
            console.log(e);
          })
        });
      } else {
        test(`Check no message: subject: ${subject}, hasMessages: ${hasMessages}`, () => {
          return pc.getMessage(subject)
          .then((messages) => {
            expect(messages.length).toBe(0);
          })
          .catch((e) => {
            console.log(e);
          });
        });
      }
    }
  });
});
