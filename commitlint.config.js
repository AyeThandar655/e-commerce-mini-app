module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'ci',
      ],
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case']],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lowercase'],
  },
};
