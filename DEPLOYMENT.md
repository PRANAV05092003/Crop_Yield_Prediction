# Deployment Guide — Crop Yield Prediction Web App

This guide covers deploying the **backend** (Render or Railway) and **frontend** (Vercel).

---

## Architecture

```
┌─────────────────┐     POST /predict      ┌──────────────────┐
│  Next.js 14     │ ───────────────────►  │  FastAPI         │
│  (Vercel)       │  GET / (health)        │  (Render/Railway) │
│  Frontend       │ ◄───────────────────  │  Backend         │
│  TypeScript     │  JSON response        │  + ML model      │
└─────────────────┘                       └──────────────────┘
        │                                            │
        │ NEXT_PUBLIC_API_URL                         │ PORT, CORS_ORIGINS
        │                                            │ (optional) train on startup
        ▼                                            ▼
   .env.local                              .env / Render/Railway env vars
```

- **Frontend**: Next.js 14 (App Router), Tailwind, ShadCN-style UI, Framer Motion. Calls backend via `NEXT_PUBLIC_API_URL`.
- **Backend**: FastAPI, loads RandomForest model from `backend/model/yield_model.joblib` (or trains from `Phase3/csv` on first start if missing).

---

## 1. Backend deployment (Render or Railway)

### Option A: Render

1. **New Web Service** from the repo.
2. **Root directory**: leave empty (repo root) or set to `backend` if you only deploy backend.
3. **Build command** (if root is repo):
   ```bash
   pip install -r backend/requirements.txt && python backend/train_model.py
   ```
   If you deploy from `backend` only:
   ```bash
   pip install -r requirements.txt
   ```
   (Then ensure `Phase3/csv` is available or the model file is committed; see “Model” below.)
4. **Start command** (run from `backend` so imports resolve):
   - If root is repo: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - If root is `backend`: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Environment variables** (Render → Environment):
   - `PORT`: Set by Render automatically.
   - `CORS_ORIGINS`: Your frontend URL, e.g. `https://your-app.vercel.app` (or `*` for dev only).
6. Save and deploy. Note the backend URL (e.g. `https://your-app.onrender.com`).

### Option B: Railway

1. **New Project** → Deploy from GitHub repo.
2. **Root directory**: `backend` (or repo root; then use `backend/` in commands below).
3. **Build**:
   ```bash
   pip install -r requirements.txt
   ```
   If you need to train the model and repo root is above `backend`, run from repo root:
   ```bash
   pip install -r backend/requirements.txt && python backend/train_model.py
   ```
4. **Start** (from `backend` directory):
   ```bash
   cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
   If Railway root is already `backend`, use: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
5. **Variables**: Add `CORS_ORIGINS` = your Vercel frontend URL. `PORT` is usually provided by Railway.
6. Deploy and copy the public backend URL.

### Model (both platforms)

- **Preferred**: Run locally once and commit the serialized model:
  ```bash
  cd /path/to/repo
  pip install -r backend/requirements.txt
  python backend/train_model.py
  git add backend/model/yield_model.joblib
  git commit -m "Add trained model"
  git push
  ```
  Then your build does **not** need to run `train_model.py`; the backend just loads `yield_model.joblib`.
- **Alternative**: Do not commit the model. Ensure the repo deployed to Render/Railway includes `Phase3/csv/phase3_input_yield.csv` (or `Production_with_weather_ndvi.csv`). In that case the backend will train on first startup and save the model (if the filesystem is writable). Build command can include `python backend/train_model.py` so the model is ready before first request.

---

## 2. Frontend deployment (Vercel)

1. **Import** the GitHub repo in Vercel.
2. **Root directory**: `frontend` (or repo root; then set root to `.` and build command below may need adjustment).
3. **Build command**: `npm run build` (default for Next.js).
4. **Environment variables** (Vercel → Settings → Environment Variables):
   - `NEXT_PUBLIC_API_URL` = your backend URL (e.g. `https://your-app.onrender.com` or `https://your-app.railway.app`). **No trailing slash.**
5. Deploy. The frontend will call the backend at `NEXT_PUBLIC_API_URL`.

---

## 3. Environment variables summary

| Where        | Variable               | Description |
|-------------|------------------------|-------------|
| **Frontend** | `NEXT_PUBLIC_API_URL`  | Backend base URL (e.g. `https://api.example.com`). |
| **Backend**  | `PORT`                 | Server port (set by Render/Railway if not provided). |
| **Backend**  | `CORS_ORIGINS`        | Comma-separated allowed origins, or `*` for dev. |

---

## 4. Run locally

**Backend**

```bash
cd /path/to/repo
pip install -r backend/requirements.txt
python backend/train_model.py   # once, to create backend/model/yield_model.joblib
cd backend && uvicorn main:app --reload --port 8000
```

Health: [http://localhost:8000](http://localhost:8000)  
Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

**Frontend**

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use “Predict” to submit data; the app will call `http://localhost:8000/predict`.

---

## 5. Copy-paste config snippets

**Render (backend, repo root)**

- Build: `pip install -r backend/requirements.txt && python backend/train_model.py`
- Start: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- Env: `CORS_ORIGINS` = `https://your-vercel-app.vercel.app`

**Vercel (frontend)**

- Framework: Next.js (auto-detected)
- Env: `NEXT_PUBLIC_API_URL` = `https://your-render-service.onrender.com`

After deployment, test the flow: open the Vercel URL → Predict → submit form → check prediction and confidence.
