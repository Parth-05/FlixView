#!/bin/bash

# Install Git LFS
curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
sudo apt-get install git-lfs

# Pull LFS files
git lfs pull

# Run the usual deployment build command for your Python project
pip install -r requirements.txt
