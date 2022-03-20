const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// 1 - get build folder
const buildPath = path.resolve(__dirname, 'build');
// 2 - remove content build folder
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'Campaign.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

// create build folder
fs.ensureDirSync(buildPath);

// console.log(JSON.parse(solc.compile(JSON.stringify(input))).contracts);
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  'Campaign.sol'
];
// write every contract
for (let contract in output) {
  console.log('contract created: ', contract);
  fs.outputJSONSync(
    path.resolve(buildPath, `${contract}.json`),
    output[contract]
  );
}
