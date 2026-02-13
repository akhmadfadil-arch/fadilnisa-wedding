# Undangan — Fadilnisa Wedding

This repository contains the static wedding invitation site (HTML/CSS/JS) used for Dwi Unzila Putri & Ahmad Bakri.

Contents:
- `index.html` — main page
- `styles.min.css` — compiled styles
- `script.js` / `script.min.js` — application logic (Firestore-powered RSVP & guestbook)
- `service-worker.js` — offline caching
- `foto/`, `img/` — media assets

How to create a GitHub repo and push this project (recommended using GitHub CLI):

1. Install Git and GitHub CLI (`gh`).
2. From this project folder run:

```powershell
# create a new repo under your account (public)
gh repo create YOUR-USERNAME/REPO-NAME --public --source . --remote origin --push

# or interactive:
gh repo create
```

3. If you prefer manual Git commands:

```powershell
git init
git add .
git commit -m "Initial commit: wedding invite site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git
git push -u origin main
```

Notes:
- If you use `gh` the script `create_github_repo.ps1` in this repo can automate creation and pushing.
- Remember to unregister any service worker in your browser when testing local changes.

License: MIT (choose your license)
