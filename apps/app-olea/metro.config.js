const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')
const fs = require('fs')

// Find the workspace root
const workspaceRoot = path.resolve(__dirname, '../..')
const projectRoot = __dirname

// Read the maintained license sources when Metro loads this configuration.
// Settings.js imports the generated JSON so these texts are bundled with the app and
// can be displayed offline in App Info.
// Restart Metro after changing LICENSE or NOTICE.txt to regenerate the JSON.
const legalNotices = {
  noticeText: fs.readFileSync(
    path.join(projectRoot, 'assets/icons/Licenses/NOTICE.txt'),
    'utf8'
  ),
  licenseText: fs.readFileSync(
    path.join(workspaceRoot, 'LICENSE'),
    'utf8'
  )
}

// Keep the generated bundle input separate from the maintained source files.
// This JSON file is excluded from Git and recreated on a fresh checkout.
const generatedDirectory = path.join(projectRoot, 'generated')
const generatedFile = path.join(generatedDirectory, 'legal-notices.json')
const generatedContent = `${JSON.stringify(legalNotices, null, 2)}\n`

// Create the output directory if it does not exist yet.
fs.mkdirSync(generatedDirectory, { recursive: true })

// Write only when the file is missing or its content has changed.
// This avoids unnecessary file updates that Metro's watcher could pick up.
if (
  !fs.existsSync(generatedFile) ||
  fs.readFileSync(generatedFile, 'utf8') !== generatedContent
) {
  fs.writeFileSync(generatedFile, generatedContent, 'utf8')
}

const config = getDefaultConfig(projectRoot)

// 1. Watch all files within the monorepo (in addition to Expo's defaults)
config.watchFolders = [...(config.watchFolders || []), workspaceRoot]
// 2. Let Metro know where to resolve packages, and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules')
]
// 3. Compile *.svg imports into React components via react-native-svg-transformer.
// Move 'svg' from assetExts to sourceExts so metro treats it as source, not an asset.
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer/expo')
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg')
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg']

module.exports = config
