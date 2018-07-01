const { execSync } = require('child_process');
const fetch = require('isomorphic-fetch');

const token = 'enter token here';
const repoName = 'do-a-bump';
const repoOrganization = 'enzoborgfrantz';

const headers = {
  Authorization: `Basic ${token}`,
  'Cache-control': 'no-cache',
};

const createBranch = version => {
  const branchName = `${repoName}-${version}-bump`;

  const result = execSync('git checkout -b ${branchName}', {
    stdio: 'inherit',
  });
  console.log(result);

  return { branchName, ...result }; // also return commit name?
};

const openPR = async (version, commitId, branchName) => {
  console.log('Opening PR...');

  const response = await fetch(
    `https://api.github.com/repos/${repoOrganization}/${repoName}/pulls`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: `Bump ${repoName} to ${version}`,
        body: `Corresponds to ${repoOrganization}/${repoName}@${commitId}`,
        head: branchName,
        base: 'master',
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Couldnt create PR: ${response.status}\n${JSON.stringify(
        await response.json(),
      )}`,
    );
  }

  console.log('Done.');
  return response.json();
};

const pollPRChecks = async prInfo => {
  const { sha } = prInfo.head;
  const response = await fetch(
    `https://api.github.com/repos/${repoOrganization}/${repoName}/commits/${sha}/status`,
    { headers },
  );

  if (!response.ok) {
    throw new Error(
      `Couldnt fetch status: ${response.status}\n${JSON.stringify(
        await response.json(),
      )}`,
    );
  }

  const { state } = await response.json();

  return state;
};

const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms));

const getPRChecksResult = async prInfo => {
  while (true) {
    /* eslint-disable-next-line no-await-in-loop */
    const state = await pollPRChecks(prInfo);

    if (state !== 'pending') {
      return state;
    }

    /* eslint-disable-next-line no-await-in-loop */
    await sleep(500);
  }
};

const mergePR = async ({ number, head: { sha } }) => {
  console.log('Merging PR...');

  const response = await fetch(
    `https://api.github.com/repos/${repoOrganization}/${repoName}/pulls/${number}/merge`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        commit_title: 'Merge ${repoName} version bump',
        commit_message: '',
        sha,
        merge_method: 'squash',
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Couldnt merge PR: ${response.status}\n${JSON.stringify(
        await response.json(),
      )}`,
    );
  }

  return response;
};

exports.updateShell = async version => {
  const result = createBranch(version);

  // const prInfo = await openPR(version, process.env.COMMIT_ID);

  // if ((await getPRChecksResult(prInfo)) !== 'success') {
  //   throw new Error('PR Checker failed.');
  // }

  // await mergePR(prInfo);

  console.log('Successfully merged booking-components bump!');
};
