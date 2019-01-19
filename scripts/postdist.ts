const fs = require('fs');
const path = require('path');
const {
  author,
  browser,
  dependencies,
  description,
  engines,
  keywords,
  license,
  main,
  name: packageName,
  repository,
  version,
} = require('../package.json');

const distPkgJSON = {
  author,
  browser,
  dependencies,
  description,
  engines,
  keywords,
  license,
  main,
  name: packageName,
  repository,
  version,
};

fs.writeFileSync(
  path.resolve(__dirname, '../dist/package.json'),
  JSON.stringify(distPkgJSON, null, 2),
);

fs.copyFileSync(
  path.resolve(__dirname, '../README.md'),
  path.resolve(__dirname, '../dist/README.md'),
);
