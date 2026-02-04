# Hello World Vue.js App

## Commands

### Development
```bash
pnpm install
pnpm run dev
```

### Build
```bash
pnpm run build
```

### Docker
```bash
docker build -t hello-world .
docker run -p 80:80 hello-world
```

## CI/CD

Pushing to `master` triggers automatic build and deployment to `ghcr.io/carmentis/demo/hello-world:latest`
