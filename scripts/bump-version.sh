#!/bin/bash

# Version management script for semantic versioning
# Usage: ./scripts/bump-version.sh [major|minor|patch]

set -e

BUMP_TYPE=${1:-patch}

# Validate input
if [[ ! "$BUMP_TYPE" =~ ^(major|minor|patch)$ ]]; then
  echo "Usage: ./scripts/bump-version.sh [major|minor|patch]"
  echo "  major - Bump major version (x.0.0)"
  echo "  minor - Bump minor version (0.x.0)"
  echo "  patch - Bump patch version (0.0.x)"
  exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT_VERSION"

# Parse version
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

# Bump version
case $BUMP_TYPE in
  major)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
  minor)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  patch)
    PATCH=$((PATCH + 1))
    ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
echo "New version: $NEW_VERSION"

# Update package.json
npm version "$NEW_VERSION" --no-git-tag-version
echo "✓ Updated package.json"

# Create git tag
git add package.json package-lock.json 2>/dev/null || git add package.json
git commit -m "chore: release v$NEW_VERSION"
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"
echo "✓ Created git commit and tag"

# Instructions
echo ""
echo "✅ Version bumped to v$NEW_VERSION"
echo ""
echo "Next steps:"
echo "  1. Review the changes: git show HEAD"
echo "  2. Push to GitHub: git push origin main --tags"
echo "  3. This will trigger the Release and Docker Publish workflows"
echo ""
