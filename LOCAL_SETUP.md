# Step-by-Step Guide: Run the Project on Localhost

Follow these steps in order to run the Crop Yield Prediction web app on your machine.

---

## Prerequisites

- **Python 3.11 or 3.12** (recommended; 3.13 may work with updated dependencies)  
  - Download: https://www.python.org/downloads/  
  - During install, check **“Add python.exe to PATH”**.
- **Node.js 18+** (for the frontend)  
  - Download: https://nodejs.org/

---

## Step 1: Open the project folder

Open Command Prompt or PowerShell and go to the project root:

```bash
cd C:\Users\HP\Downloads\Crop-yield-prediction-using-weather-data-and-NDVI-time-series-main
```

*(Use your actual path if different.)*

---

## Step 2: Backend — Install Python dependencies

From the **project root** (same folder as `backend` and `frontend`), run:

```bash
py -m pip install -r backend/requirements.txt
```

- If `py` is not recognized, try: `python -m pip install -r backend/requirements.txt`
- If you see errors about compiling (e.g. NumPy / GCC), use **Python 3.11 or 3.12** and run the same command again.

---

## Step 3: Backend — Train the model (first time only)

Still in the **project root**, run:

```bash
py backend/train_model.py
```

*(Or: `python backend/train_model.py`)*

You should see: `Model saved to ... backend\model\yield_model.joblib`

---

## Step 4: Backend — Start the API server

1. Go into the backend folder:

   ```bash
   cd backend
   ```

2. Start the server:

   ```bash
   py -m uvicorn main:app --reload --port 8000
   ```

   *(Or: `python -m uvicorn main:app --reload --port 8000`)*

3. Leave this terminal open. You should see something like:
   - `Uvicorn running on http://127.0.0.1:8000`

4. Quick checks:
   - In the browser open: **http://localhost:8000**  
     You should see: `{"status":"ok","model":"loaded"}` (or similar).
   - API docs: **http://localhost:8000/docs**

---

## Step 5: Frontend — Open a second terminal

Open a **new** Command Prompt or PowerShell window (keep the backend running in the first one).

---

## Step 6: Frontend — Install Node dependencies

From the **project root**:

```bash
cd C:\Users\HP\Downloads\Crop-yield-prediction-using-weather-data-and-NDVI-time-series-main
cd frontend
npm install
```

Wait until `npm install` finishes.

---

## Step 7: Frontend — Set the API URL

1. Copy the example env file:

   ```bash
   copy .env.example .env.local
   ```

   *(PowerShell: `Copy-Item .env.example .env.local`)*

2. Open `frontend\.env.local` in a text editor and ensure this line is set:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

   (No trailing slash. Save the file.)

---

## Step 8: Frontend — Start the dev server

Still in the **frontend** folder, run:

```bash
npm run dev
```

You should see something like: `Local: http://localhost:3000`

---

## Step 9: Use the app in the browser

1. Open: **http://localhost:3000**
2. You should see the **Crop Yield Prediction** landing page.
3. Click **“Get prediction”** or **“Predict”** to open the prediction form.
4. Fill in (or keep the default) weather and NDVI values, then click **“Predict yield”**.
5. The result (predicted yield and confidence) appears below the form.

---

## Summary: What runs where

| What        | URL                    | Terminal / step      |
|------------|------------------------|----------------------|
| Backend API | http://localhost:8000  | Step 4 — `cd backend` then `py -m uvicorn main:app --reload --port 8000` |
| API docs   | http://localhost:8000/docs | Same as backend        |
| Frontend   | http://localhost:3000  | Step 8 — `cd frontend` then `npm run dev` |

---

## Troubleshooting

- **“pip is not recognized”**  
  Use: `py -m pip install -r backend/requirements.txt` (or `python -m pip ...`).

- **“uvicorn is not recognized”**  
  Use: `py -m uvicorn main:app --reload --port 8000` from the `backend` folder.

- **“No module named uvicorn”**  
  Install dependencies again from the project root:  
  `py -m pip install -r backend/requirements.txt`

- **NumPy / GCC build errors**  
  Use Python 3.11 or 3.12 and re-run:  
  `py -m pip install -r backend/requirements.txt`

- **“The system cannot find the path specified” when running `cd backend`**  
  You are probably already inside `backend`. Run only:  
  `py -m uvicorn main:app --reload --port 8000`

- **Prediction fails or “Model not available”**  
  From the **project root**, run:  
  `py backend/train_model.py`  
  Then restart the backend (Step 4).

- **Frontend can’t reach the API**  
  Ensure backend is running on port 8000 and `frontend\.env.local` has:  
  `NEXT_PUBLIC_API_URL=http://localhost:8000`  
  Restart the frontend (`npm run dev`) after changing `.env.local`.
