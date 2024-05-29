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
