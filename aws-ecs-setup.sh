# install ECS cli
sudo curl \
  -Lo /usr/local/bin/ecs-cli \
  https://amazon-ecs-cli.s3.amazonaws.com/ecs-cli-linux-amd64-latest
sudo chmod +x /usr/local/bin/ecs-cli
echo "Installed $(ecs-cli --version)"

# install GPG
sudo apt-get install gnupg

# import key
gpg --import ./signature.key