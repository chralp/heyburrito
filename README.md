
# Slack application heyburrito!

Give away burritos to your colleagues!
( If you want to be mean you can send :rottenburrito: to decrement thier score.. )

### Requirments
redis,
node,
slack ( ofc )

### How to get started

Go to https://yourworkspace.slack.com/apps and search for Bots.
Add " Bots ( Connect a bot to the Slack Real Time Messaging API) ".
Give the bot a name, ex: heyburrito.
Obtain apiToken.
Copy conf-localhost-example.json to conf-localhost.json
( Create several if u want diffrent configurations depending on environment! ).
Add Apitoken to conf-localhost.json.

Download redis ( i pref docker => https://hub.docker.com/_/redis/ )

Add redis configuration to conf-localhost.json.

Invite the new bot to the channels.


### Missing / issues

1. mini front-end
2. getRedisUsers promise
3. Merge slackUsersData with RedisUsers to serve front-end
4. Daily send burritoCap (?)
5. Tests