const execa = require('execa');
const Listr = require('listr');

const tasks = new Listr([
  {
    title: 'Git',
    task: () =>
      new Listr([
        {
          title: 'Checking git status',
          task: () =>
            execa.stdout('git', ['status', '--porcelain']).then(result => {
              if (result !== '') {
                throw new Error(
                  'Unclean working tree. Commit or stash changes first.',
                );
              }
            }),
        },
      ]),
  },
]);

tasks.run().catch(err => {
  console.error(err);
});
