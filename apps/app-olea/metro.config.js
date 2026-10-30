const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

// Find the workspace root
const workspaceRoot = path.resolve(__dirname, '../..');
const projectRoot = __dirname;

// Lizenztexte für das App-Bundle erzeugen.
// Nach Änderungen an LICENSE oder NOTICE.txt Metro neu starten.
const legalNotices = {
  noticeText: fs.readFileSync(
    path.join(projectRoot, 'assets/icons/Licenses/NOTICE.txt'),
    'utf8'
  ),
  licenseText: fs.readFileSync(
    path.join(workspaceRoot, 'LICENSE'),
    'utf8'
  ),
};

const generatedDirectory = path.join(projectRoot, 'generated');
const generatedFile = path.join(generatedDirectory, 'legal-notices.json');
const generatedContent = `${JSON.stringify(legalNotices, null, 2)}\n`;

fs.mkdirSync(generatedDirectory, { recursive: true });

if (
  !fs.existsSync(generatedFile) ||
  fs.readFileSync(generatedFile, 'utf8') !== generatedContent
) {
  fs.writeFileSync(generatedFile, generatedContent, 'utf8');
}

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

module.exports = config;
