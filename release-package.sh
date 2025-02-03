#!/bin/bash
# package.sh - Automates building and packaging the extension for Chrome & Firefox

set -e  # Exit on first error

# Clean previous build artifacts
rm -rf dist proto*.zip proto*.xpi

# Run build command (assuming Bun + Vite)
bun run build

# Function to package for a given browser
package_extension() {
  local browser=$1
  local manifest_source="public/manifest.${browser}.json"
  
  if [ ! -f "$manifest_source" ]; then
    echo "Manifest file $manifest_source not found! Skipping $browser build."
    return
  fi

  echo "Packaging for $browser using $manifest_source..."
  
  # Copy the selected manifest file
  cp "$manifest_source" dist/manifest.json
  echo "Copied $manifest_source to dist/manifest.json"

  # Zip contents of dist/
  zip -r "proto-${browser}.zip" dist/*
  echo "Created archive: proto-${browser}.zip"

  # If Firefox, create .xpi file
  if [ "$browser" == "firefox" ]; then
    mv "proto-${browser}.zip" "proto-${browser}.xpi"
    echo "Packaged Firefox extension as proto-${browser}.xpi"
  fi
}

# If TARGET_BROWSER is set, package only for that browser
if [[ -n "$TARGET_BROWSER" ]]; then
  package_extension "$TARGET_BROWSER"
else
  # Otherwise, build for both Chrome & Firefox
  package_extension "chrome"
  package_extension "firefox"
fi

echo "Packaging complete!"
