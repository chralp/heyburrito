<p align="center">
    <img src="https://user-images.githubusercontent.com/13852280/41594451-c511cb82-73c3-11e8-87fa-aab8ccf2c816.png" width="50%" height="50%">
</p>    
  
### Whats Heyburrito
Heyburrito slack application allows you to send :burrito: to your colleagues / friends, each burrito is converted to points witch can be showed on a scoreboard.
Heyburrito is like heytaco, but free and you host it yourself.

### How does it work
Each burrito will increment the users "burrito" - points.
And a rottenburrito will decrement "burrito" - points

Give away burrito ( :burrito: ) to a colleague if they done something good.
...Or maybe a rottenburrito ( :rottenburrit: , emoji needed ) if they done something bad.. :)

Ping one or several of your colleagues and give away :burritos: if the deserv it. Otherwise :rottenburrito: if not ...  

Example:  
This will increase chralps "burrito" - points by 3
`@chralp :burrito::burrito::burrito: - awesome app!` 

This will decrease chralps "burrito" - points by 2
`@chralp :rottenburrito::rottenburrito: - bad app...`

This will increase chralps and fagges "burrito" - points by 2 ( each )
`@chralp @fagge :burrito::burrito: - awesome app!` 


### Requirments
- slack ( ofc )
- mongodb
- node ( lts/dubnium ) 

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

| ENV Variables    | Default | Required | Note                                                                        |
| ---------------- | ------  | ------   | -------                                                                     |
| THEME            | default | No       | See Theme section                                                           |
| BOT_NAME         |         | Yes      | Same botname as in Get started section                                      |
| DATABASE_DRIVER  |         | Yes      | See database drivers section                                                |
| MONGODB_URL      |         | Yes*     | Only requierd if DATABASE_DRIVER is mongodb                                 |
| MONGODB_DATABASE |         | Yes*     | Only requierd if DATABASE_DRIVER is mongodb                                 |
| SLACK_API_TOKEN  |         | Yes      | See Get started section                                                     |
| SLACK_EMOJI_INC  |         | Yes      | Emoji to increment points. ex:( :burrito: )                                 |
| SLACK_EMOJI_DEC  |         | No       | Emoji to decrement points. ex:( :rottenburrito: ). Disabled if not provided |
| SLACK_DAILY_CAP  | 5       | No       | Defaults to 5/day                                                           |

### Database drivers

| Name    | Recomended | Note                           |
|---------|------------|--------------------------------|
| mongodb | Yes        |                                |
| array   | No         | Used when testing, "memmoryDB" |


### Theme
You will be able to provide a link to a gitrepo. When linking to a gitrepo, heyburrito will install and use the theme. ( not working yet tho.. see issue https://github.com/chralp/heyburrito/issues/37 ).

Defaults today to heyburritotheme. Heyburritotheme is a fork of https://github.com/tbleckert/cardi-burrito .

Available third party themes
---------------------------------
| Name          | Author    | link                                       |
|---------------|-----------|--------------------------------------------|
| cardi-burrito | tbleckert | https://github.com/tbleckert/cardi-burrito |

If you want your theme to be on the list, create a PR or issue!

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
