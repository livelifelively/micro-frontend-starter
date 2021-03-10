/* eslint-disable prettier/prettier */

// TODO enable passing build environment as a variable

const { execSync } = require('child_process');

const globby = require('globby');
const fs = require('fs');
const path = require('path');

// TODO Explore running command with 'lerna changed'
// TODO use chalk to color the text.

(async () => {
  const paths = await globby([
    './src/**/package.json',
    '!./src/**/node_modules/**/package.json',
    '!./src/**/lib/**/package.json',
  ]);

  console.log(`${paths.length} Packages found`);

  // lerna changed for packages that changed
  paths.forEach((element) => {
    const packageJson = 'package.json';
    const targetPath = element.substring(0, element.length - packageJson.length);
    const packageJSONData = fs.readFileSync(element);
    const packageJSONDataParsed = JSON.parse(packageJSONData);
    console.log(packageJSONDataParsed.name);

    // console.log(element);
    // console.log(packageJSONDataParsed);
    // console.log(targetPath + packageJSONDataParsed.main);
    // console.log(targetPath + packageJSONDataParsed.module);

    const absOutputPath = path.resolve(__dirname, targetPath, 'lib');

    // #TODO pass buildENV as variable.
    // const buildEnv = 'testing';
    const buildEnv = 'production';

    // console.log(absOutputPath);
    const command = `ENTRY=${
      targetPath + packageJSONDataParsed.module
    } OUTPUT=${absOutputPath} BUILD_ENV=${buildEnv} npm run build-testing`;

    console.log(command);

    const stdOut = execSync(command);

    // TODO write logs to file
    console.log(stdOut.toString());

    packageJSONDataParsed.main = 'lib/index.js';

    fs.writeFileSync(`${absOutputPath}/package.json`, JSON.stringify(packageJSONDataParsed));
    console.log('========================================================================');
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('========================================================================');
    console.log('');
    console.log('');
  });
})();
