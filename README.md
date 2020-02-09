![Logo](resources/logo.png)

[![forthebadge](https://forthebadge.com/images/badges/makes-people-smile.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
  
### Whats Heyburrito
Heyburrito is a slack reward system that allows slack team members to recognize and reward team members who have performed well. Reward your colleagues / friends by sending them a :burrito:, each burrito is converted to points witch can be showed on a scoreboard.
Heyburrito is like heytaco, but free and you host it yourself.


### How does it work
Each burrito will increment the users "burrito" - points.
And a rottenburrito will decrement "burrito" - points

Give away burrito  to a colleague if they done something good.
...Or maybe a rottenburrito ( :rottenburrito: , emoji needed ) if they done something bad.. :)

Ping one or several of your colleagues and give away a burrito if they deserv it. Otherwise rottenburrito if not ...

Example:  
This will increase chralps "burrito" - points by 3
`@chralp :burrito::burrito::burrito: - awesome app!` 

This will decrease chralps "burrito" - points by 2
`@chralp :rottenburrito::rottenburrito: - bad app...`

This will increase chralps and fagges "burrito" - points by 2 ( each )
`@chralp @fagge :burrito::burrito: - awesome app!` 

You can run heyburrito and disable rottenburrito by passing environment variables.
By disabling decrement you can send rottenburritos but it will not decrement the users score.

In the default theme you will find filters to show diffrent leaderboards, burrito board and rottenburrito board. If env for disable decrement is passed the burrito board will not count rottenburritos. But you can see leaderboard for rottenburritos ( sent and received ).

You can also disable decrement emoji completely. This way you will not be able to send any decrement score.

Check environment variables section.

### Requirments
- slack ( of course )
- node ( lts/erbium ) 

### Get started

1. Go to https://yourworkspace.slack.com/apps and search for Bots.  
2. Add **Bots ( Connect a bot to the Slack Real Time Messaging API)**.  
3. Give the bot a name, ex: heyburrito, and obtain apiToken.  
4. Choose how to run it => See Docker or Node section .
5. Invite the new bot to your slack channels ( where u want to be able to send burritos ).

### Docker
1. Open and edit `docker-compose.yml`.
2. Set environment variables that you need / want. Check "Environment variables" for more details.
3. `docker-compose up -d`.

( Dockerhub repo => https://hub.docker.com/r/chralp/heyburrito  )
### Node
1. `git clone git@github.com:chralp/heyburrito.git`
2. `cd heyburrito`
3. `npm install`
4. `cp .env.example .env`
5. Set environment variables that you need / want. Check "Environment variables" for more details.
6. `npm run start`


### Environment Variables

| ENV Variables       | Default Value                              | Required | Note                                                              |
| ----------------    | -------------                              | ------   | -----------                                                       |
| BOT_NAME            |                                            | Yes      | Same botname as in Get started section                            |
| DATABASE_DRIVER     | file                                       | No       | See database drivers section                                      |
| DATABASE_PATH       | projectRoot/data/                          | No       | Only use if DATABASE_DRIVER is file and u want to change the path |
| MONGODB_URL         |                                            | Yes*     | Only requierd if DATABASE_DRIVER is mongodb                       |
| MONGODB_DATABASE    |                                            | Yes*     | Only requierd if DATABASE_DRIVER is mongodb                       |
| DATABASE_URI        | MONGODB_URL/MONGODB_DATABASE               | No       | Only in use when DATABASE_DRIVER is mongodb                       |
| SLACK_API_TOKEN     |                                            | Yes      | See Get started section                                           |
| SLACK_EMOJI_INC     | :burrito:                                  | No       | Emoji to increment points. ex:( :burrito: )                       |
| SLACK_EMOJI_DEC     | :rottenburrito:                            | No       | Emoji to decrement points. ex:( :rottenburrito: )                 |
| SLACK_DAILY_CAP     | 5                                          | No       | Defaults to 5/day .                                               |
| SLACK_DAILY_DEC_CAP | 5                                          | No       | separate cap ONLY IF env ENABLE_DECREMENT is set to false.        |
| DISABLE_EMOJI_DEC   | false                                      | No       | Disable rottenburrito completely, set true to disable             |
| ENABLE_DECREMENT    | true                                       | No       | Enable decrement of points, set false to disable                  |
| API_PATH            | /api/                                      | No       | Must start and end with slash                                     |
| WEB_PATH            | /heyburrito/                               | No       | Serving html from .                                               |
| HTTP_PORT           | 3333                                       | No       | For API and website                                               |
| WSS_PORT            | 3334                                       |  No        |                                                                   |
| THEME_URL           | https://github.com/chralp/heyburrito-theme | No       | Pass git url to theme                                             |
| THEME_LATEST        | false                                      | No       | Donwload latest from git repo on start                            |
| THEME_PATH          |                                            | No       | Pass local path to theme                                          |
| LOG_LEVEL           | prod = info, dev = debug                   | No       | levels = debug, log, warn                                         |

  
### Database drivers

| Name    | Recomended | Note                           |
|---------|------------|--------------------------------|
| mongodb | Yes        |                                |
| file    | Yes        | Creates a fileDB under projectRoot/data/burrito-{ENV}.db |
| array   | No         | Used when testing, "memmoryDB" |


### Theme
Defaults to heyburrito-theme. [https://github.com/chralp/heyburrito-theme](https://github.com/chralp/heyburrito-theme)
If you want link a theme from disk, check environment variables THEME_PATH .
  
#### Available third party themes
| Name          | Author    | link                                       |
|---------------|-----------|--------------------------------------------|
| cardi-burrito | tbleckert | https://github.com/tbleckert/cardi-burrito |

If you want your theme to be on the list, create a PR or issue!

### API
#### Return object
```
{
  "error": boolean,
  "code": HTTP codes as number,
  "message": String or null,
  "data": Object or array
} 
```
#### Values
| Param          | Value    |
|---------------|-----------|
| userId | slack userId |
| listType | to / from |
| scoreType | inc / dec |

#### api/scoreboard
````
GET /api/scoreboard/<listType>/<scoreType> 
````
Example
````
GET /api/scoreboard/to/inc
````
````JSON
{
  "error": false,
  "code": 200,
  "message": "ok",
  "data": [
    {
      "username": "USER3",
      "name": "User3",
      "avatar": "https://link.to.avatar.48.burrito",
      "memberType": "member",
      "score": 9
    },
    {
      "username": "USER5",
      "name": "User5",
      "avatar": "https://link.to.avatar.48.burrito",
      "memberType": "member",
      "score": 7
    }
  ]
}
````

#### api/userscore
````
GET /api/userscore/<userId>/<listType>/<scoreType> 
````
Example
````
GET /api/userscore/USER2/to/inc
````
````JSON
{
  "error": false,
  "code": 200,
  "message": "ok",
  "data": {
    "username": "USER2",
    "name": "User2",
    "avatar": "https://link.to.avatar.48.burrito",
    "memberType": "member",
    "score": 5,
    "scoreType": "inc",
    "listType": "to"
  }
}
````

#### api/userstats
````
GET /api/userstats/<userId>
````
Example
````
GET /api/userstats/USER2
````
````JSON
{
  "error": false,
  "code": 200,
  "message": "ok",
  "data": {
    "user": {
      "username": "USER2",
      "name": "User2",
      "avatar": "https://link.to.avatar.48.burrito",
      "memberType": "member",
      "receivedToday": 1,
      "givenToday": 0,
      "received": 2,
      "given": 2
    },
    "given": [
      {
        "username": "USER8",
        "name": "USER8",
        "avatar": "https://link.to.avatar.48.burrito",
        "memberType": "member",
        "scoreinc": 1,
        "scoredec": 0
      },
      {
        "username": "USER9",
        "name": "USER9",
        "avatar": "https://link.to.avatar.48.burrito",
        "memberType": "member",
        "scoreinc": 0,
        "scoredec": 1
      }
    ],
    "received": [
      {
        "username": "USER20",
        "name": "USER20",
        "avatar": "https://link.to.avatar.48.burrito",
        "memberType": "member",
        "scoreinc": 1,
        "scoredec": 0
      },
      {
        "username": "USER25",
        "name": "USER25",
        "avatar": "https://link.to.avatar.48.burrito",
        "memberType": "member",
        "scoreinc": 1,
        "scoredec": 0
      },
    ],
    "givenToday": [],
    "receivedToday": [
      {
        "username": "USER33",
        "name": "USER33",
        "avatar": "https://link.to.avatar.48.burrito",
        "memberType": "member",
        "scoreinc": 1,
        "scoredec": 0
      }
    ]
  }
}
````
#### api/userstats/today
````
GET api/userstats/today/<userId>
````
Example
````
GET api/userstats/today/USER2
````
````JSON
{
   "error": false,
   "code": 200,
   "message": "ok",
   "data": {
     "givenToday": 0,
     "receivedToday": 1
  }
}
````



### Scoreboard
Scoreboard is accessable via localhost or host on port `3333`.

Showcase
-----------
<p align="center">
    <img src="https://user-images.githubusercontent.com/13852280/51863905-8fddc400-2342-11e9-8ace-c21c675264d2.png" width="75%" height="75%">
</p>    

<p align="center">
    <img src="https://user-images.githubusercontent.com/13852280/51863890-82283e80-2342-11e9-95c6-a37d2d3aeac7.png" width="75%" height="75%">
  </p>    
