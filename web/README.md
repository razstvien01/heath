# 🧠 Web App - Heath

---

## 🚀 Getting Started

### 🔧 Install Dependencies

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

### ▶️ Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 🌍 API Endpoints

All backend API routes are under:

```
/src/app/api/
```

You can access them at:

```bash
http://<your-local-ip>:3000/api/<endpoint>
```

Use this base URL in your **Flutter app's** `ApiService`.

---

## 🔒 Environment Variables

Create a `.env` file in the root and configure it as needed:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

---

## 📁 Project Structure Overview

```
src/
├── app/              # Next.js App Router
│   └── api/          # API routes used by Flutter
├── components/       # UI and page components
│   ├── pages/
│   └── ui/
├── config/           # App configuration
├── constants/        # App-wide constants
├── contexts/         # React Contexts
├── dto/              # Data Transfer Objects
├── interfaces/       # TypeScript interfaces
├── lib/              # Utility functions
├── mappers/          # Mapping DTOs <-> Models
├── models/           # Domain models
├── repositories/     # Data access layer
├── services/         # Business logic
└── setup/            # App setup logic
```

---
