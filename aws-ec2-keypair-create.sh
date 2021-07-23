#!/bin/bash

aws ec2 create-key-pair \
  --key-name heyburrito-cluster \
  --query 'KeyMaterial' \
  --profile heyburrito \
  --output text > ~/.ssh/heyburrito-cluster.pem
