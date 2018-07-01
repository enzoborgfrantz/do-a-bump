const inquirer = require('inquirer');
const semver = require('semver');
const { execSync } = require('child_process');

const { versionTypePrompt, customVersionTypePrompt } = require('./prompts');
const { npmBumpVersion, npmPublish } = require('./npmHelpers');
const { createBranch } = require('./gitHelpers');

const getNextVersion = async currentVersion => {
  const { versionType } = await inquirer.prompt(
    versionTypePrompt(currentVersion),
  );

  if (versionType !== 'other') {
    return semver.inc(currentVersion, versionType);
  }

  const { customVersion } = await inquirer.prompt(customVersionTypePrompt);

  return customVersion;
};

const bump = async ({ resolveCurrentVersion }) => {
  const currentVersion = await resolveCurrentVersion();
  const version = await getNextVersion(currentVersion);
  console.log('next verison is: ', version);
  npmBumpVersion(version);
  npmPublish();
  createBranch(version);
};

const getCurrentVersion = async () => Promise.resolve('0.0.9');

bump({ resolveCurrentVersion: getCurrentVersion });
