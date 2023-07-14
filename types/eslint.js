module.exports = {
  rules: {
    semi: ['error', 'never'],
    'vue/max-attributes-per-line': 'off',
    'vue/no-template-target-blank': 'off',
    'comma-dangle': ['error', 'never'],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreUrls: true, // 长url
        ignoreStrings: true, // 长字符串
        ignoreRegExpLiterals: true, // 长正则
        ignoreTemplateLiterals: true // 长模板字符串
      }
    ],
    'vue/max-len': [
      'error',
      {
        code: 120,
        template: 80,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true,
        ignoreHTMLTextContents: true
      }
    ],
    'arrow-body-style': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-param-reassign': ['error', { props: false }],
    'no-console': 'off',
    'no-plusplus': 'off',
    'linebreak-style': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'no-debugger': 'off'
  }
}
