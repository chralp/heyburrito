
![1](https://user-images.githubusercontent.com/13852280/41594451-c511cb82-73c3-11e8-87fa-aab8ccf2c816.png)
# Slack application heyburrito! :burrito:

Give away :burrito: to your colleagues!  
( If you want to be mean you can send a :rottenburrito: to decrement thier score.. )  
This application is like heytaco for slack, but free, and you host it yourself.

### Requirments
- redis
- node
- slack ( ofc )

### How to get started

1. Go to https://yourworkspace.slack.com/apps and search for Bots.  
2. Add **Bots ( Connect a bot to the Slack Real Time Messaging API)**.  
3. Give the bot a name, ex: heyburrito, and obtain apiToken.  
4. Copy conf-localhost-example.json to conf-localhost.json (Create several if u want diffrent configurations depending on environment!).  
5. Add Apitoken to conf-localhost.json.

Download redis ( i pref docker => https://hub.docker.com/_/redis/ )  
Add redis configuration to conf-localhost.json.

Invite the new bot to the channels.

### Try it out!
Ping one or several of your colleagues and give away :burritos: if the deserv it. Otherwise :rottenburrito: if not ...  

Example:  
`@chralp :burrito::burrito::burrito: - awesome app!`  
`@chralp :rottenburrito::rottenburrito: - bad app...`

A scoreboard can be viewed at port `3333`.

### Emojis
If you don't want to use :burrito: or :rottenburrito: as emojis, you can easily change / add emojis in configuration file.

```JSON
{
    "emojis":
    [
        {
            "emoji":":chralp:",
            "type":"inc"
        },
        {
            "emoji":":zombiechralp:",
            "type":"dec"
        }
    ]
}
```

##### Available types

With types you can define which emojis should increment or decrement the score when giving away a :burrito: or other emoji .

| type        | info           
| ------------- |:-------------:
| inc      | increment 
| dec      | decrement      



### Missing / issues

- [x] mini front-end ( done )
- [x] getRedisUsers promise ( done )
- [x] Merge slackUsersData with RedisUsers to serve front-end ( done )
- [ ] Daily send burritoCap (?)
- [ ] Tests
