# VegitoPraiser

![ter 24 out 2023 14:41:12 -03](https://github.com/fernando-gap/VegitoPraiser/assets/63003765/2223ab42-fec2-4729-a193-0fe9b73c537e)


## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction
Vegito is a worshipper discord bot made for **fun**. 

Praise to progress by using the command `/praise` to send a special **message** to Vegito as much as you want! The main goal of this bot is to be dragon ball centered specially around Vegito. 

Her e is one of the praise message samples:
> "In the symphony of the universe, Vegito, your essence is the harmony that binds us all."



## Features
Bundled With more than 200+ messages, Vegito is equiped with
* currency
* shop
* cooldown
* notifications

## Installation
Fellow Vegito fan you can add this bot to your server by using the following link: 
> [Invite VegitoPraiser to Discord ](https://discord.com/oauth2/authorize?client_id=1166046068350406838)

## Usage
For users, add the bot to one of your servers and try searching one of the VegitoPraiser's commands when you type "/" in the discord chat.

If you want to use the source code, or contribute to VegitoPraiser (yay!) you might have to create a new discord [application](https://discord.com/developers/docs/quick-start/getting-started) before continue, you need the configuration "application.commands", and "bot" enabled.

## Configuration
This is the configuration for contributing. 

1. Clone this repo or fork:
```
git clone https://github.com/fernando-gap/VegitoPraiser.git
```

2. install both dev and non-dev dependencies
```
npm install
```

3. Create configuration files files.

3.1. Create `src/config.js` bot configuration file at the project's root under `VegitoPraiser/`, then paste the following structure and replace the values for your application you want test on.
```js
export default {
  token: <token>,
  clientId: <client-id>,
  devGuildId: <dev-server-id>, // optional
}
```

3.2. Create the database config file `db_dev.env` under the project root
```
# mysql config
MYSQL_ROOT_PASSWORD="vegito"
MYSQL_DATABASE="vegito"
MYSQL_USER="vegito"
MYSQL_PASSWORD='vegito'
MYSQL_HOST="127.0.0.1"
MYSQL_PORT="3307"
```

3.3. Same as for database, but for the scheduler, create `db_scheduler_dev.env` and add:
```
# mongo config
MONGO_INITDB_ROOT_USERNAME="root"
MONGO_INITDB_ROOT_PASSWORD="1234"
MONGO_DB_PORT="27018"
MONGO_DB_HOST="localhost"
MONGO_DB_AUTH_DATABASE="admin"
MONGO_INITDB_DATABASE="agenda"
```
4. You need docker, and docker compose because VegitoPraiser uses two databases, once installed you can start them with:
```
docker compose -f docker-compose.dev.yml up                                                                 
``` 

5. VegitoPraiser uses Typescript, to build it:
```
npx tsc
```

6. You run with the following command (on linux)
```
NODE_ENV=development node build/main.js                                                               
```

## Project Structure
## Contributing
You can contribute by opening an issue! If you have an idea or a bug fix, or an addition, open an issue and we can fondly discuss about it, be welcomed!

## License
This project is MIT licensed.

## Contact

You can contact me in discord by the username of `nandoka.` (dot included) or send email to `nandoka1957@gmail.com`.
