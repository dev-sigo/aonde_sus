export default {
  '*.{js, jsx}': ['eslint --fix'],
  '*.{css,scss,html}': ['prettier --write'],
  '*.[!config]{js, jsx}': 'npm test -- --findRelatedTests',
};
