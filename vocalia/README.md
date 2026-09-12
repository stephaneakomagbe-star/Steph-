# VocalIA

Application de transcription audio et d’assistant vocal pour réunions et prédications.

## Lancer en local

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Créez `backend/.env` avec `GROQ_API_KEY=...` (ne commitez jamais ce fichier).

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Le modèle Whisper n’est chargé qu’au premier usage de la transcription, pour que la connexion fonctionne tout de suite.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Ouvrez l’adresse indiquée par Vite (souvent `http://localhost:5173`). En développement, les appels `/api` sont envoyés au backend `http://127.0.0.1:8000`.

Les deux services doivent tourner en même temps.

## Application Android (Capacitor)

Au build, définissez l’URL du backend, par exemple :

`VITE_API_URL=http://VOTRE_IP_LOCALE:8000 npm run build`

Puis `npx cap sync android`.
