ecs-cli compose \
  --project-name heyburrito \
  --file docker-compose.yml \
  --debug service up  \
  --deployment-max-percent 100 \
  --deployment-min-healthy-percent 0 \
  --region eu-west-1 \
  --ecs-profile heyburrito \
  --cluster-config heyburrito