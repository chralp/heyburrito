
# Slack application heyburrito!

Give away :burritos: to your colleagues!  
( If you want to be mean you can send :rottenburrito: to decrement thier score.. )  
This application is like heytaco for slack, but free, and you host it yourself.

### Requirments
- redis
- node
- slack ( ofc )

### How to get started

Go to https://yourworkspace.slack.com/apps and search for Bots.  
Add **Bots ( Connect a bot to the Slack Real Time Messaging API)**.  
Give the bot a name, ex: heyburrito, and obtain apiToken.  
Copy conf-localhost-example.json to conf-localhost.json  
( Create several if u want diffrent configurations depending on environment! ).  
Add Apitoken to conf-localhost.json.

Download redis ( i pref docker => https://hub.docker.com/_/redis/ )  
Add redis configuration to conf-localhost.json.

Invite the new bot to the channels.

### Try it out!
Ping one or several of your colleagues and give away :burritos: if the deserv it. Otherwise :rottenburrito: if not ...  
Example:  
`@chralp :burrito::burrito::burrito: - awesome app!`  
`@chralp :rottenburrito::rottenburrito: - bad app...`

### Emojis
If you dosent want to use :burrito: or :rottenburrito: as emojis, you can easily change / add emojis in configuration file.

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

1. mini front-end ( done )
2. getRedisUsers promise ( done )
3. Merge slackUsersData with RedisUsers to serve front-end ( done )
4. Daily send burritoCap (?)
5. Tests
