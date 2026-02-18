# Deploying to Vercel

This project is a static site. Use one of the methods below to deploy or redeploy to Vercel.

1) Quick (local CLI using npx)

Make sure Node.js (with npm/npx) is installed and you're logged in to Vercel:

```powershell
npx vercel login
```

Then run from the project root:

```powershell
npx vercel --prod --confirm
# or using the helper script
# .\deploy-vercel.ps1
```

2) CI / Git provider

- Push your repository to GitHub/GitLab/Bitbucket and connect the project in the Vercel dashboard. Pushing to the linked Git branch will trigger automatic builds.

Notes:
- `vercel.json` is configured for a static deploy and sets several cache headers.
- If you changed `script.js` or `styles.*.css`, remember to clear caches (or update filenames) if you use aggressive caching on Vercel.