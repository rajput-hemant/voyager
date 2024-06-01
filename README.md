<div align=center>

# Voyager

## Building from Source

</div>

- Fetch latest source code from master branch.

```
git clone https://github.com/rajput-hemant/voyager
cd voyager
```

- Run the app with VS Code or the command line:

```
bun i || pnpm i || npm i || yarn
bun dev || pnpm dev || npm run dev || yarn dev
```

<div align=center>

### Docker and Makefile

</div>

- Build the Docker Image and start the container:

```
make build
make start
```

- Stop the Docker container:

```
make stop
```

<div align=center>

### Polling Notes

</div>

Using [Vercel CRON jobs](https://vercel.com/docs/cron-jobs), the backend can continuously poll for new blocks every minute.

> [!NOTE]
> Due to 1-minute granularity, it is not currently possible to poll for new blocks every 30 seconds. [(see here)](https://vercel.com/docs/cron-jobs#cron-expressions)

To set up the polling, create a new `vercel.json` file in the root directory and add the following code, or rename `vercel.example.json` to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/trpc/seed.seedDB",
      "schedule": "* * * * *"
    }
  ]
}
```

<div align="center">OR</div>

```
mv vercel.example.json vercel.json
```

> [!NOTE]
> In the current deployment, the page is revalidated every 30 seconds, during revalidation i am seeding all the transactions from the `latest block` to the `last block` stored in the database.

<div align=center>

### Deploy Your Own

You can deploy your own hosted version of `voyager`. Just click the link below to deploy a ready-to-go version to Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rajput-hemant/voyager&env=DATABASE_URL,DATABASE_AUTH_TOKEN)

</div>
