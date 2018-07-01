const inquirer = require('inquirer');
const semver = require('semver');
const { execSync } = require('child_process');

const { versionTypePrompt, customVersionTypePrompt } = require('./prompts');

const getNextVersion = async currentVersion => {
  const { versionType } = await inquirer.prompt(versionTypePrompt);

  if (versionType !== 'other') {
    return semver.inc(currentVersion, versionType);
  }

  const { customVersion } = await inquirer.prompt(customVersionTypePrompt);

  return customVersion;
};

const npmBumpVersion = version => {
  try {
    execSync(`npm version ${version} --no-git-tag-version`);
    console.log(
      'Package version was bumped, changes were committed to git and version tag was created.',
    );
  } catch (e) {
    console.error('Failed to bump package version');
    console.error(e.stderr.toString());
    return null;
  }
};

const npmPublish = () => {
  try {
    console.log('Will publish to latest tag.gitlog, here are the tag details:');
    execSync(`npm publish --tag latest`);
  } catch (e) {
    console.error('Failed to publish');
    return null;
  }
};

const bump = async ({ resolveCurrentVersion }) => {
  const currentVersion = await resolveCurrentVersion();
  const nextVersion = await getNextVersion(currentVersion);
  console.log('next verison is: ', nextVersion);
  npmBumpVersion(nextVersion);
  npmPublish();
};

const getCurrentVersion = async () => Promise.resolve('0.0.1');

bump({ resolveCurrentVersion: getCurrentVersion });
