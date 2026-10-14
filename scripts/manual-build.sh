#!/usr/bin/env bash
# Build the site locally and push it to the "site" branch (what CI does on main)
set -euo pipefail

cd "$(dirname "$0")/.."

rm -rf docs
git clone -b site --single-branch git@github.com:omrilotan/do.git docs
find docs -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +

npm run build

cd docs
git add --all
git commit -m "Manual build $(git -C .. rev-parse --short HEAD)"
git push origin site
