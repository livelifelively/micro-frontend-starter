// module.exports = {
//   stories: ['../src/**/*.stories.js'],
//   addons: [
//     '@storybook/addon-docs',
//     'storybook-addon-react-docgen',
//     '@storybook/addon-actions',
//     {
//       name: '@storybook/preset-ant-design',
//       options: {
//         lessOptions: {
//           modifyVars: {
//             'primary-color': '#ff0000',
//             'border-radius-base': '2px',
//           },
//         },
//       },
//     },
//   ],
// };
module.exports = {
  stories: ['../src/**/*.stories.js'],
  addons: ['@storybook/addon-docs'],
};
