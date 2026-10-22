# Freetracker  

Freetracker is version 2.0 of my other repository called Freelancr. It is a web application for freelancers and small businesses to onboard clients, book meetings, extract meeting notes/transcripts, and use these to track the scope of a project to combat scope creep and unruly clients.  

## Technology Stack  

frontend: Next.js (React + Typescript), TailwindCSS  
Backend: Python Django, Django REST Framework  
Database: PostgreSQL  

## Running it locally  

### Backend  

```bash
cd backend
python -m venv venv && venv/Scripts/Activate
pip install -r requirements.txt
cp .env # edit DB credentials to match your local Postgres
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### frontend

```bash
cd frontend
npm install
npm run dev
```