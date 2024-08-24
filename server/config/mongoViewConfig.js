let changesDetected = false;

module.exports = {
  getChangesDetected: () => changesDetected,
  setChangesDetected: (value) => { changesDetected = value; },
};
