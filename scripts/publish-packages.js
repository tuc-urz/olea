#!/usr/bin/env node

/**
 * Automated script to publish consolidated @olea-bps packages to npm
 * Now with 21 packages instead of 83
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Parse command line arguments
const isDryRun = process.argv.includes('--dry-run');
const skipBuild = process.argv.includes('--skip-build');

console.log('========================================');
console.log('OLEA Consolidated Package Publishing');
console.log('========================================');
console.log(`Mode: ${isDryRun ? 'DRY RUN' : 'LIVE PUBLISH'}`);
console.log(`Build: ${skipBuild ? 'SKIPPED' : 'ENABLED'}`);
console.log('========================================\n');

// Define packages in dependency order
const publishOrder = {
  phase1_leaf: [
    // Libraries - No workspace dependencies
    'packages/libraries/core-plugins',
    'packages/libraries/stored-state',
    'packages/libraries/base-api-provider',
    'packages/libraries/notifications',
    'packages/libraries/icons-openasist',
    'packages/libraries/react-native-webview-autoheight',
    'packages/libraries/redux-offline', // Requires build

    // Context - Leaf packages (no dependencies on other workspaces)
    'packages/context/context-user',
    'packages/context/context-event',
    'packages/context/context-canteen',
    'packages/context/context-connectivity',
  ],

  phase2_core: [
    // Core library (depends on core-plugins, redux-offline)
    'packages/libraries/core',

    // Context packages depending on base-api-provider
    'packages/context/context-news',
    'packages/context/context-timetable',
    'packages/context/context-callmanager',
    'packages/context/context-flex-menu',
    'packages/context/context-info-dialog',
    'packages/context/context-public-transport-ticket',
    'packages/context/context-mails',
  ],

  phase3_ui: [
    // Consolidated components package (depends on core, contexts, other libs)
    'packages/components',

    // Consolidated views package (depends on components, core, contexts)
    'packages/views',
  ],
};

/**
 * Build a package if it requires compilation
 */
function buildPackage(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  if (packageJson.scripts && packageJson.scripts.build) {
    console.log(`  🔨 Building ${packageJson.name}...`);
    try {
      execSync('npm run build', {
        cwd: packagePath,
        stdio: 'inherit'
      });
      console.log(`  ✅ Build successful\n`);
      return true;
    } catch (error) {
      console.error(`  ❌ Build failed for ${packageJson.name}`);
      throw error;
    }
  }
  return false;
}

/**
 * Publish a single package
 */
function publishPackage(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    console.error(`  ❌ package.json not found at ${packagePath}`);
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const packageName = packageJson.name;
  const packageVersion = packageJson.version;

  console.log(`  📦 Publishing ${packageName}@${packageVersion}...`);

  try {
    // Build if needed (only for redux-offline currently)
    if (!skipBuild && packagePath.includes('redux-offline')) {
      buildPackage(packagePath);
    }

    // Publish command
    const publishCmd = `npm publish --access public${isDryRun ? ' --dry-run' : ''}`;

    execSync(publishCmd, {
      cwd: packagePath,
      stdio: 'inherit'
    });

    console.log(`  ✅ ${packageName}@${packageVersion} ${isDryRun ? 'verified' : 'published'}\n`);
    return true;
  } catch (error) {
    console.error(`  ❌ Failed to publish ${packageName}`);
    console.error(`  Error: ${error.message}\n`);
    return false;
  }
}

/**
 * Publish a phase of packages
 */
function publishPhase(phaseName, packagePaths) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${phaseName.toUpperCase()}`);
  console.log(`Packages to publish: ${packagePaths.length}`);
  console.log(`${'='.repeat(60)}\n`);

  const results = {
    success: 0,
    failed: 0,
    failedPackages: []
  };

  for (const packagePath of packagePaths) {
    const fullPath = path.resolve(process.cwd(), packagePath);

    if (publishPackage(fullPath)) {
      results.success++;
    } else {
      results.failed++;
      results.failedPackages.push(packagePath);
    }
  }

  console.log(`\n${phaseName} Summary:`);
  console.log(`  ✅ Success: ${results.success}`);
  console.log(`  ❌ Failed: ${results.failed}`);

  if (results.failed > 0) {
    console.log(`\n  Failed packages:`);
    results.failedPackages.forEach(pkg => console.log(`    - ${pkg}`));
    throw new Error(`Phase ${phaseName} had ${results.failed} failures`);
  }

  return results;
}

/**
 * Main execution
 */
async function main() {
  const startTime = Date.now();
  const allResults = {
    phase1_leaf: null,
    phase2_core: null,
    phase3_ui: null,
  };

  try {
    // Verify we're in the right directory
    if (!fs.existsSync('package.json')) {
      throw new Error('Not in repository root. Please run from the root directory.');
    }

    // Phase 1: Leaf packages (no workspace dependencies)
    allResults.phase1_leaf = publishPhase(
      'Phase 1: Leaf Packages (Libraries & Base Contexts)',
      publishOrder.phase1_leaf
    );

    // Phase 2: Core and context packages
    allResults.phase2_core = publishPhase(
      'Phase 2: Core Library & Contexts',
      publishOrder.phase2_core
    );

    // Phase 3: Consolidated UI packages
    allResults.phase3_ui = publishPhase(
      'Phase 3: Consolidated UI (Components & Views)',
      publishOrder.phase3_ui
    );

    // Final summary
    const totalSuccess = Object.values(allResults).reduce((sum, r) => sum + r.success, 0);
    const totalFailed = Object.values(allResults).reduce((sum, r) => sum + r.failed, 0);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n\n' + '='.repeat(60));
    console.log('FINAL SUMMARY');
    console.log('='.repeat(60));
    console.log(`Mode: ${isDryRun ? 'DRY RUN ✓' : 'LIVE PUBLISH ✓'}`);
    console.log(`Total packages: ${totalSuccess + totalFailed} (down from 83!)`);
    console.log(`  ✅ Successful: ${totalSuccess}`);
    console.log(`  ❌ Failed: ${totalFailed}`);
    console.log(`Duration: ${duration}s`);
    console.log('='.repeat(60));

    console.log('\nPackage Breakdown:');
    console.log('  • 8 Libraries');
    console.log('  • 11 Contexts');
    console.log('  • 1 Consolidated Components (was 39 packages)');
    console.log('  • 1 Consolidated Views (was 25 packages)');
    console.log('  = 21 Total Packages');

    if (!isDryRun) {
      console.log('\n🎉 All packages published successfully!');
      console.log('\nNext steps:');
      console.log('1. Verify packages on npm: npm view @olea-bps/components');
      console.log('2. Test installation: npm install @olea-bps/components@^1.0.0');
    } else {
      console.log('\n✅ Dry run completed successfully!');
      console.log('\nTo publish for real, run:');
      console.log('  node scripts/publish-packages.js');
    }

  } catch (error) {
    console.error('\n\n❌ Publishing failed!');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
main();
