const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the workspace root
const workspaceRoot = path.resolve(__dirname, '../..');
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo (in addition to Expo's defaults)
config.watchFolders = [...(config.watchFolders || []), workspaceRoot];
// 2. Let Metro know where to resolve packages, and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
// 3. Compile *.svg imports into React components via react-native-svg-transformer.
// Move 'svg' from assetExts to sourceExts so metro treats it as source, not an asset.
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer/expo');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// 4. Shim the Node core module 'punycode' to its userland npm package.
// markdown-it (via react-native-markdown-display) does `require('punycode')`,
// which the React Native runtime doesn't provide. Alias it to the installed
// 'punycode' package so Metro can bundle it.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  punycode: require.resolve('punycode/'),
};

module.exports = config;
