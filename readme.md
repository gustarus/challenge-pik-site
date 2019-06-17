# Challenge pik site
Site based on svelte app for [site.challenge-pik.webulla.ru](http://site.challenge-pik.webulla.ru).

## Get started
1. Install the dependencies.

```bash
cd challenge-pik-site
npm install
```

2. Then start server.
```bash
npm start
```

Navigate to [localhost:8000](http://localhost:8000).
You should see your app running.
Edit a component file in `app`, save it, and the page should reload with your changes.

## Deploying to the web
1. Configure env variables.
```bash
cp .env.template .env
subl .env
```

2. Run deploy script.
```bash
sh deploy.sh
```
