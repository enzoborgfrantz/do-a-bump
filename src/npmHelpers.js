exports.npmBumpVersion = version => {
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

exports.npmPublish = () => {
  try {
    console.log('Will publish to latest tag.gitlog, here are the tag details:');
    execSync(`npm publish --tag latest`);
  } catch (e) {
    console.error('Failed to publish');
    return null;
  }
};
