#!/bin/bash

ecs-cli up \
  --keypair heyburrito-cluster  \
  --capability-iam \
  --size 1 \
  --instance-type t2.micro \
  --tags project=heyburrito-cluster \
  --cluster-config heyburrito \
  --ecs-profile heyburrito