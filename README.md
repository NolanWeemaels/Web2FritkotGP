[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=22117229)

# Frontend De Fritkot Grand Prix

This is the frontend for the courseproject of WEB 2.  
Users can register or log in, pick a Formula 1 team, and then run a 3-round simulation (Galmaarden → Knokke → Brussel).  
Each round includes a mandatory “fritkot pitstop” and the results are saved via my own API.  
On the results page, users can view their best runs and delete them.

Frontend url: [FRITKOT GP FRONTEND](https://nolanweemaels.github.io/Web2FritkotGP/index.html)  
API url: [FRITKOT GP API](https://web2-course-project-back-end-bh78.onrender.com/)

---

## Up & running
Steps to run frontend local:

1. Open terminal
2. Make sure you are in the correct folder (the Vite project folder, e.g. `fritkotgp`)
3. Install packages: `npm install`
4. Run: `npm run dev`

### Environment (.env)
Create a `.env` file inside the Vite folder (example: `fritkotgp/.env`):

and paste this inside of it: VITE_API_BASE=https://web2-course-project-back-end-bh78.onrender.com

## Sources 

- Vite env variables (import.meta.env / VITE_API_BASE) — used in: used in: src/script.js
    [https://vite.dev/guide/env-and-mode.html](https://vite.dev/guide/env-and-mode.html)

- Vite static assets (public folder & asset handling) — used in: src/script.js
    [https://vite.dev/guide/assets.html](https://vite.dev/guide/assets.html)

- localStorage (saving token + user) — used in: src/script.js
    [https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

- Fetch API (HTTP requests to my API) — used in: src/script.js
    [https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

- sessionStorage (saving session race data between rounds) — used in: src/script.js
    [https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

- URLSearchParams (redirect after login via ?next=) — used in: src/script.js
    [https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

- requestAnimationFrame (homepage car animation loop) — used in: src/script.js
    [https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)

- Element.querySelector / querySelectorAll (DOM selection helpers) — used in: src/script.js
    [https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)

- addEventListener (click/submit handlers) — used in: src/script.js
    [https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

- Fixing GIT problems — used in general
    [https://chatgpt.com/share/69585d2f-372c-800f-8905-72c379c8d9d8](https://chatgpt.com/share/69585d2f-372c-800f-8905-72c379c8d9d8)

- Basic CSS style — used in src/style.css
    [https://chatgpt.com/share/6957c32f-0a10-800f-80d1-059acbab77be](https://chatgpt.com/share/6957c32f-0a10-800f-80d1-059acbab77be)