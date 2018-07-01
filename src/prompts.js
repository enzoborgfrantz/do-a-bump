const semver = require('semver');

const VERSION_TYPES = ['patch', 'minor', 'major', 'other'];

exports.versionTypePrompt = {
  type: 'list',
  name: 'versionType',
  message: 'What kind of version bump would you like to make',
  choices: VERSION_TYPES.map(versionType => ({
    name: versionType,
    value: versionType,
  })),
};

exports.customVersionTypePrompt = {
  type: 'input',
  name: 'customVersion',
  message: 'Enter a custom version',
  validate: version =>
    Boolean(semver.valid(version)) || 'Please enter a valid semver version',
};
