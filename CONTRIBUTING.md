# Contributing

You can contribute by opening an issue! If you have an idea or a bug fix, or an addition, open an issue and we can fondly discuss about it, be welcomed!

## Configuration

Set up development configuration for VegitoPraiser. The only requirement is that you have to create a discord bot in your account.

WARNING: This was only tested on linux.

Clone this repo or fork:

```
git clone https://github.com/fernando-gap/VegitoPraiser.git
```

Install dependencies

```
npm install
```

Create `src/config.js` file at the project's root under, then paste the following structure and replace the respective values for the bot you created.

```js
export default {
  token: <token>,
  clientId: <client-id>,
  devGuildId: <dev-server-id>, // optional
}
```

Create the file `db_dev.env` to configure the database under the project root.

```
# mysql config
MYSQL_ROOT_PASSWORD="vegito"
MYSQL_DATABASE="vegito"
MYSQL_USER="vegito"
MYSQL_PASSWORD='vegito'
MYSQL_HOST="127.0.0.1"
MYSQL_PORT="3307"
```

Same as above, but for the scheduler, create `db_scheduler_dev.env` file and add:

```
# mongo config
MONGO_INITDB_ROOT_USERNAME="root"
MONGO_INITDB_ROOT_PASSWORD="1234"
MONGO_DB_PORT="27018"
MONGO_DB_HOST="localhost"
MONGO_DB_AUTH_DATABASE="admin"
MONGO_INITDB_DATABASE="agenda"
```

Once the environment files are configured, you can start the databases by using docker compose:

```
docker compose -f docker-compose.dev.yml up
```

Before running VegitoPraiser you have to compile it to Javascript, to build it, the compiled files are located at `build/`:

```
npx tsc
```

You run with the following command (on linux)

```
NODE_ENV=development node build/main.js
```
