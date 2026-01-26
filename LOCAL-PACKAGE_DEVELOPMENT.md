# Local Package Development Tutorial

This tutorial explains how to develop OLEA packages locally and link them to your app project for testing without publishing.

## Overview

When developing packages in the OLEA monorepo, you'll want to test changes in your app without publishing to npm after every change. There are several approaches:

## Method 1: Yarn Link

### Step 1: Register the packages for linking

In the OLEA monorepo, navigate to each package you want to develop and register it:

```bash
# Example: linking the core library
cd <PROJECTPATH>/olea/packages/libraries/core
yarn link

# Link other packages as needed
cd <PROJECTPATH>/olea/packages/context/context-news
yarn link
```

### Step 2: Use the linked packages in your app

In your app project, link to the registered packages:

```bash
cd <APPPROJECTPATH>/openasist
yarn link "@olea-bps/core"
yarn link "@olea-bps/context-news"
# ... repeat for other packages
```

### Step 3: Unlink when done

```bash
# In your app project
yarn unlink "@olea-bps/core"

# In the package directory (to unregister)
cd <PROJECTPATH>/olea/packages/libraries/core
yarn unlink
```

## Method 2: Yarn Resolutions with File Protocol

Add resolutions to your app's `package.json`:

```json
{
  "resolutions": {
    "@olea-bps/core": "file:<PROJECTPATH>/olea/packages/libraries/core",
    "@olea-bps/context-news": "file:<PROJECTPATH>/olea/packages/context/context-news"
  }
}
```

Then run `yarn install` to apply the resolutions.

## Method 3: Yalc (Recommended for React Native)

Yalc is often more reliable for React Native projects as it avoids symlink issues with Metro bundler.

### Install yalc globally

```bash
npm install -g yalc
```

### Publish packages locally

```bash
# In the OLEA monorepo
cd <PROJECTPATH>/olea/packages/libraries/core
yalc publish

# For other packages
cd <PROJECTPATH>/olea/packages/context/context-news
yalc publish
```

### Add to your app project

```bash
cd <APPPROJECTPATH>/openasist
yalc add @olea-bps/core
yalc add @olea-bps/context-news
```

### Push updates after changes

After making changes to a package:

```bash
cd <PROJECTPATH>/olea/packages/libraries/core
yalc push  # Automatically updates all projects using this package
```

### Clean up

```bash
cd <APPPROJECTPATH>/openasist
yalc remove @olea-bps/core
yalc remove --all  # Remove all yalc packages
```

## Quick Reference Script

Create a helper script `scripts/link-local.sh` in your app project:

```bash
#!/bin/bash
OLEA_PATH="<PROJECTPATH>/olea/packages"

# Using yalc (recommended)
yalc add @olea-bps/core --link
yalc add @olea-bps/base-api-provider --link
yalc add @olea-bps/context-news --link
# Add more packages as needed

echo "Local packages linked. Run 'yalc push' in package dirs after changes."
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Metro can't find linked package | Clear Metro cache: `yarn start --reset-cache` |
| Duplicate React instances | Add `react` to `resolver.extraNodeModules` in metro.config.js |
| Changes not reflected | Run `yalc push` or restart Metro bundler |
| Symlink errors on iOS | Use yalc instead of yarn link |

## Recommendation

For React Native development, **yalc is the most reliable option** because:
- It copies files instead of symlinking (avoids Metro issues)
- The `yalc push` command automatically updates all linked projects
- Works consistently across macOS, Linux, and Windows
