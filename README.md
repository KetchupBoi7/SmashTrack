# ASHS SmashTrack

Runs badminton, table tennis and squash club sessions from one screen. Type in who turned up, pick a play style, and SmashTrack fills the courts, runs the match clock with a buzzer, records results with one tap, and keeps the leaderboard, match history and tournament or league standings.

Made by Keshav for Albany Senior High School. Free for anyone to use, under the [MIT licence](LICENSE).

Live site: https://ketchupboi7.github.io/SmashTrack/

## What is in this repository

| File | What it does |
|---|---|
| `index.html` | The whole app in one file, with both fonts built in |
| `sw.js` | Service worker, so the site keeps working offline after the first visit |
| `manifest.webmanifest` | Lets people install it to a home screen or desktop |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` | App icons |
| `og-image.png` | The preview picture shown when the link is shared |
| `privacy.html` | Privacy and terms, linked from the About page |
| `404.html` | The page GitHub Pages shows for an address that does not exist |
| `robots.txt`, `sitemap.xml` | For search engines (they only take effect on a custom domain) |
| `LICENSE`, `NOTICE.md` | The licence, and the licences of the built-in fonts |
| `.github/workflows/check.yml` | A check that runs on every push |

There is no build step, no server and no accounts. `index.html` also works on its own: double-click it and it opens straight off the disk.

## Putting it online with GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings**, then **Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, pick `main` and `/ (root)`, and save.
3. On the same page, tick **Enforce HTTPS**.
4. Wait a minute or two. The site appears at `https://<your-username>.github.io/<repository-name>/`.

The address is written into `index.html` (the `canonical` and `og:` tags), `privacy.html`, `404.html`, `robots.txt` and `sitemap.xml`. If the site moves to a different address, such as a custom domain, search for `ketchupboi7.github.io/SmashTrack` and replace it in those files.

## Uploading a new version

1. Change `index.html` (or `privacy.html`).
2. In `sw.js`, change `VERSION` to something new, for example today's date.
3. Commit both files.

If you skip step 2, browsers that have visited before can keep showing the old version. The check on pull requests fails when you forget.

## How offline works

The first visit needs a connection. After that the service worker keeps a copy in the browser, so the site opens and runs with the wifi off, including recording results and downloading the season file. On a phone, tablet or Chromebook, "Add to home screen" makes it open like a normal app.

## How saving works

Everything is saved in the browser as you go, and each browser keeps its own separate copy. When a session finishes, press **End session & download** on the Session tab. That files the session and downloads a season file. Keep that file somewhere safe; next time, press **Open a season file** to carry on from any computer.

## Privacy

No accounts, no analytics, no cookies and no requests to other sites. Names and results never leave the device. See [privacy.html](privacy.html).
