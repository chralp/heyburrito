#!/bin/bash
set -e
PROFILE_NAME=heyburrito
CLUSTER_NAME=heyburrito-cluster
LAUNCH_TYPE=EC2

ecs-cli configure profile \
  --profile-name "$PROFILE_NAME" \
  --access-key "$AWS_ACCESS_KEY_ID" \
  --secret-key "$AWS_SECRET_ACCESS_KEY" \

ecs-cli configure \
  --cluster "$CLUSTER_NAME" \
  --default-launch-type "$LAUNCH_TYPE" \
  --region "$AWS_REGION" \
  --config-name "$PROFILE_NAME"