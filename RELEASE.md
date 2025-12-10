# Release Management Guide

This guide explains how to manage releases, versioning, and Docker image publishing for the Notes App.

## Overview

The release pipeline consists of:
1. **Semantic Versioning** - Automatic version bumping (major.minor.patch)
2. **GitHub Releases** - Automated changelog and release notes
3. **Docker Publishing** - Push images to Docker Hub and GitHub Container Registry

## Quick Start

### Option 1: Using the Script (Recommended)

```bash
# Bump patch version (1.0.0 -> 1.0.1)
./scripts/bump-version.sh patch

# Bump minor version (1.0.1 -> 1.1.0)
./scripts/bump-version.sh minor

# Bump major version (1.1.0 -> 2.0.0)
./scripts/bump-version.sh major
```

The script will:
- Update `package.json`
- Create a git commit with the version change
- Create a git tag (e.g., `v1.0.1`)
- Show instructions to push the changes

Then push to GitHub:
```bash
git push origin main --tags
```

### Option 2: Using GitHub UI

1. Go to your repository **Actions** tab
2. Select **Release - Semantic Versioning** workflow
3. Click **Run workflow**
6. Click **Run workflow**

- Calculate the new version
- Update `package.json`
- Create a git commit and tag
- Create a GitHub Release with changelog

## Setting Up Docker Registry Secrets

For Docker image publishing, configure these GitHub Secrets:

### Docker Hub
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add:
   - `DOCKER_USERNAME` - Your Docker Hub username
   - `DOCKER_PASSWORD` - Your Docker Hub access token (not password)

**To create Docker Hub token:**
- Go to https://hub.docker.com/settings/security
- Click **New Access Token**
- Use token value for `DOCKER_PASSWORD`

### GitHub Container Registry (GHCR)
- Automatically uses `GITHUB_TOKEN` (no additional setup needed)
- Images pushed to `ghcr.io/your-org/notes-app`

## Workflow Details

### Release Workflow (release.yml)

Triggered by:
- Manual trigger via **Run workflow** button
- Automatically on git tags matching pattern `v*`

2. Calculate new version based on bump type
3. Update `package.json`
6. Push commits and tags to main branch
7. Create GitHub Release with changelog

**Outputs:**
- Updated `package.json` in git
- Git tag: `v1.0.0`
- GitHub Release with automatic changelog

### Docker Publish Workflow (docker-publish.yml)

Triggered by:
- GitHub Release published
- Push to tags matching `v*`

2. Set up Docker Buildx for efficient builds
3. Login to Docker Hub (if credentials provided)
5. Build and push to GitHub Container Registry:
   - `ghcr.io/org/notes-app:1.0.0`
   - `ghcr.io/org/notes-app:latest`
6. Add image tags and metadata

**Outputs:**
- Docker images pushed to registries
- Images tagged with version and `latest`
- Build summary in GitHub Actions

## Versioning Strategy

### Semantic Versioning (SemVer)

Format: `MAJOR.MINOR.PATCH`

- **MAJOR** - Breaking changes, incompatible API updates
- **MINOR** - New features, backward compatible
- **PATCH** - Bug fixes, minor improvements

**Examples:**
- `1.0.0` - Initial release
- `1.0.1` - Bug fix patch
- `1.1.0` - New feature
- `2.0.0` - Major breaking changes

### Tagging Conventions

All releases are tagged with `v` prefix:
- `v1.0.0`
- `v1.0.1`
- `v1.1.0`
- `v2.0.0`

## Viewing Releases

### On GitHub
1. Go to **Releases** tab
2. See all versions with:
   - Release notes
   - Commit list
   - Release date
   - Links to Docker images

### Docker Images

**Docker Hub:**
```bash
docker pull username/notes-app:1.0.0
docker pull username/notes-app:latest
```

**GitHub Container Registry:**
```bash
docker pull ghcr.io/your-org/notes-app:1.0.0
docker pull ghcr.io/your-org/notes-app:latest
```

## Example Release Workflow

1. **Code changes and testing:**
   ```bash
   git checkout main
   git pull origin main
   # ... make changes and commit ...
   git push origin main
   ```

2. **Bump version:**
   ```bash
   ./scripts/bump-version.sh minor
   ```

3. **Push to trigger workflows:**
   ```bash
   git push origin main --tags
   ```

4. **Monitor workflows:**
   - Go to **Actions** tab
   - Watch **Release - Semantic Versioning** complete
   - Then **Publish Docker Image** workflow will start
   - Check GitHub **Releases** for published release
   - Check Docker Hub/GHCR for published images

5. **Use the release:**
   ```bash
   # Pull latest image
   docker pull username/notes-app:latest
   
   # Or use specific version
   docker pull username/notes-app:1.1.0
   ```

## Troubleshooting

### Release workflow fails on tag push
- Ensure git is configured correctly: `git config --local user.name "Your Name"`
- Check that the branch is `main` or `develop`

### Docker push fails
- Verify Docker Hub credentials are correct
- Check Docker Hub token hasn't expired
- Ensure token has push permissions

### No images pushed to Docker Hub
- Check if `DOCKER_USERNAME` secret is configured
- If not set, images are only pushed to GHCR

### GitHub Container Registry access denied
- Ensure workflow has `packages: write` permission
- Check GHCR token permissions

## CI/CD Integration

The release pipeline integrates with the test pipeline:
1. **Tests run** on every push to `main` (ci-test-notify.yml)
2. **After tests pass**, you can trigger releases manually
3. **On release tag**, Docker images are automatically built and pushed
4. **Notifications** sent to Slack/email with release info

## Next Steps

After setting up releases:
1. Configure Docker Hub/GHCR secrets
2. Create first release using `./scripts/bump-version.sh`
3. Monitor the workflows on GitHub Actions
4. Pull and test the Docker image
5. Use images for staging/production deployments
