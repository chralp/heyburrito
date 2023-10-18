![Logo](resources/hey_burrito_github.png)

<div style="text-align: center;">
  <a href="https://forthebadge.com"><img src="https://forthebadge.com/images/badges/makes-people-smile.svg" alt="Makes people smile"></a>
  <a href="https://forthebadge.com"><img src="https://forthebadge.com/images/badges/built-with-love.svg" alt="Built with love"></a>
</div>
  
### Whats HeyGoose 🪿
HeyGoose is a slack reward system that allows slack team members to recognize and reward team members who have performed well. Reward your colleagues / friends by sending them a :goose:, each goose is converted to points witch can be showed on a scoreboard.
HeyGoose is like heytaco, but free and you host it yourself.


### How does it work
Each goose will increment the users "goose" - points.
And a rottengoose will decrement "goose" - points

Give away goose  to a colleague if they done something good.
...Or maybe a rottengoose ( :rottengoose: , emoji needed ) if they done something bad.. :)

Ping one or several of your colleagues and give away a goose if they deserv it. Otherwise rottengoose if not ...

Example:  
This will increase chralps "goose" - points by 3
`@chralp :goose::goose::goose: - awesome app!` 

This will decrease chralps "goose" - points by 2
`@chralp :rottengoose::rottengoose: - bad app...`

This will increase chralps and fagges "goose" - points by 2 ( each )
`@chralp @fagge :goose::goose: - awesome app!` 

You can run heygoose and disable rottengoose by passing environment variables.
By disabling decrement you can send rottengooses but it will not decrement the users score.

In the default theme you will find filters to show diffrent leaderboards, goose board and rottengoose board. If env for disable decrement is passed the goose board will not count rottengooses. But you can see leaderboard for rottengooses ( sent and received ).

You can also disable decrement emoji completely. This way you will not be able to send any decrement score.

Check environment variables section.

### Requirments
- slack ( of course )
- node ( lts/erbium ) 
- yarn package manager (if you don't install, install it with `npm install -g yarn`)

### Get started

1. Go to https://yourworkspace.slack.com/apps and search for Bots.  
2. Add **Bots ( Connect a bot to the Slack Real Time Messaging API)**.  
3. Give the bot a name, ex: heygoose, and obtain apiToken.  
4. Choose how to run it => See Docker or Node section .
5. Invite the new bot to your slack channels ( where u want to be able to send gooses ).

### Docker
1. Open and edit `docker-compose.yml`.
2. Set environment variables that you need / want. Check "Environment variables" for more details.
3. `docker-compose up -d`.

( Dockerhub repo => https://hub.docker.com/r/chralp/heyburrito  )
### Node
1. `git clone git@github.com:chralp/heyburrito.git`
2. `cd heyburrito`
3. `yarn install` or `yarn`
4. `cp .env.example .env`
5. Set environment variables that you need / want. Check "Environment variables" for more details.
6. `yarn start`


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


### Emojis
Rottengoose and goose emoji can be found under resources ( Burrito.png and Rottenburrito.png ).
You can add the emojis in slack via the emoji toolbox => Add emoji.
Its not possible to overwrite the standard goose emoji in slack, so if you want to use heygoose goose emoji you can set a new name for it.

Note, set the ENV keys SLACK_EMOJI_INC and SLACK_EMOJI_DEC with the emojis that you want to use.
If u want to use the standard goose emoji and our goose emoji you have to pass both emojis in SLACK_EMOJI_INC.
ex:
If you set our goose with name :burre: .
ENV SLACK_EMOJI_INC should look like this.
```
SLACK_EMOJI_INC :goose:, :burre:
```

### Theme
Defaults to heygoose-theme. [https://github.com/chralp/heyburrito-theme](https://github.com/chralp/heyburrito-theme)
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
From heygoose-theme ( [https://github.com/chralp/heyburrito-theme](https://github.com/chralp/heyburrito-theme) ) 
<p align="center">
    <img src="https://user-images.githubusercontent.com/13852280/74108695-3e832a00-4b7d-11ea-91ec-162a0ad46532.png" width="75%" height="75%">
</p>    

<p align="center">
    <img src="https://user-images.githubusercontent.com/13852280/74108696-3f1bc080-4b7d-11ea-9a99-6bac9631e608.png" width="75%" height="75%">
  </p>    

<p align="center">
    <img src="https://user-images.githubusercontent.com/13852280/74108698-3fb45700-4b7d-11ea-893b-21d33238efa1.png" width="75%" height="75%">
</p>    

<p align="center">
    <img src="https://user-images.githubusercontent.com/13852280/74108699-3fb45700-4b7d-11ea-9e21-1da65a583a0d.png" width="75%" height="75%">
  </p>    
