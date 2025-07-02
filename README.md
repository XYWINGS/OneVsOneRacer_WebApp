# 🏁 OneVSOne – Real-Time 2-Player Car Racing Game

**OneVSOne** is a browser-based, real-time, top-down 1v1 car racing game. Players can create or join a room and race head-to-head on a digital track. First to the finish wins!

Built using modern full-stack technologies with WebSocket-based multiplayer support.

---

## 🚀 Features

- 🧑‍🤝‍🧑 **2-player real-time multiplayer**
- ⏱️ **Countdown before race start**
- 🏎️ **Smooth top-down car controls**
- 💬 **Join with room code**
- 📡 **WebSocket-based movement sync**
- 🔁 **Rematch / Restart support**
- 🎨 **Canvas-rendered game graphics**

---

## 🧱 Tech Stack

| Layer         | Tech                        |
|---------------|-----------------------------|
| Frontend      | React, Next.js, TypeScript  |
| Game Rendering| HTML Canvas API             |
| Backend       | NestJS, Socket.IO           |
| Realtime Comm | WebSockets (Socket.IO)      |
| Deployment    | Docker, GitHub Actions      |
| Optional      | Redis (for scalable state)  |

---

## 🗂️ Project Structure

```

onevsone/
├── client/           # Next.js frontend
├── server/           # NestJS backend with WebSocket gateway
├── docker-compose.yml
├── README.md

````

---

## 🛠️ Getting Started (Local Dev)

### Clone the repository

```bash
git clone https://github.com/your-username/onevsone.git
cd onevsone
````

* Backend: [http://localhost:4000](http://localhost:4000)

---

## 💡 Development Scripts

### Frontend

```bash
cd client
npm install
npm run dev
```

## 🧪 Planned Enhancements

* 🏆 Leaderboard with persistent scoring
* 🔄 Matchmaking (auto room join)
* 🎵 Background music + sound effects
* 📱 Mobile controls (touch input)
* 👁️ Spectator mode (watch others race)

---

## 🤝 Contributing

Pull requests are welcome! If you'd like to help with the game logic, UI, or backend, feel free to fork the repo and open a PR.

---

## 🌐 Live Demo

Coming soon… 🕹️
