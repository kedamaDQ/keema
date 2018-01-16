
const deepFreeze = (o) => {
  Object.freeze(o);
  Object.keys(o).forEach((key) => {
    if (o.hasOwnProperty(key) && typeof o[key] === 'object' && Object.isFrozen(o[key])) {
      deepFreezer(o[key]);
    }
  });
};

export default deepFreeze;