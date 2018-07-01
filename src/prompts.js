const semver = require('semver');

const VERSION_TYPES = {
  patch: 'patch',
  minor: 'minor',
  major: 'major',
  other: 'other',
};

const getVersionTypeChoice = currentVersion => (versionType, description) => ({
  name: `${versionType} ${semver.inc(
    currentVersion,
    versionType,
  )} ${description}`,
  value: versionType,
});

const versionTypeChoices = currentVersion => {
  const versionTypeChoice = getVersionTypeChoice(currentVersion);

  return [
    versionTypeChoice(VERSION_TYPES.patch, '(backwards-compatible bug fixes)'),
    versionTypeChoice(
      VERSION_TYPES.minor,
      '(adding backwards-compatible functionality)',
    ),
    versionTypeChoice(VERSION_TYPES.major, '(incompatible API changes)'),
    {
      name: 'other (custom version bump)',
      value: 'other',
    },
  ];
};

exports.versionTypePrompt = currentVersion => ({
  type: 'list',
  name: 'versionType',
  message: 'What kind of version bump would you like to make',
  choices: versionTypeChoices(currentVersion),
});

exports.customVersionTypePrompt = {
  type: 'input',
  name: 'customVersion',
  message: 'Enter a custom version',
  validate: version =>
    Boolean(semver.valid(version)) || 'Please enter a valid semver version',
};
