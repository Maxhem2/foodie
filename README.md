# Foodie

Food managment App using FastAPI and MongoDB on the backend and ReactJS on the frontend.

<hr>

## How to run Locally?

### Backend


- To run the backend, you need to have a local mongodb instance running. To setup a deployed instance using [MongoDB Community Download](https://www.mongodb.com/try/download/community) -> Downloading and running Compass is recomended.

- This project has been built with Python 3.9.0 [Python 3.9 Download](https://www.python.org/downloads/release/python-390/) and Node.js v18.15.0 [Node.js v18.15 Download](https://nodejs.org/ca/blog/release/v18.15.0).

### Setting up `.env` file

To setup `.env` file on the backend, create a file named `.env` in `/backend/app`.
Add the following in the `.env` file.

```txt
JWT_SECRET_KEY=<RAMDOM_STRING>
JWT_REFRESH_SECRET_KEY=<RANDOM_SECTURE_LONG_STRING>
MONGO_CONNECTION_STRING=<MONGO_DB_CONNECTION_STRING>
# mongodb://localhost:27017/ <-- for local running instances
```

### Installing dependencies

Assuming you are in the projects base directory

```bash
cd backend
pip install -r requirements.txt
```

### Running the backend

Assuming you are in the projects backend directory.

```bash
uvicorn app.app:app --reload
```

<hr>

## Frontend

### Install dependecies

Assuming you are in the projects base directory.

```bash
cd frontend
```

```bash
npm install
```

### Running frontend

```bash
npm start
```

<hr>

## How to run selfhosted?
(Publicly accessible)

### Running the backend

Assuming you are in the projects backend directory.

```bash
uvicorn app.app:app --reload --host <YOUR_IP_ADDRESS>
```

In the projects backend directory under `app/core/config.py` make the following change:

```
class Settings(BaseSettings):
...
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://<YOUR_IP_ADDRESS>:3000"
    ]
...
```

### Running frontend

```bash
set HOST=<YOUR_IP_ADDRESS>
npm start
```

In the projects frontend directory under `scr/services/axios.js` make the following change:

```
const baseURL = "http://<YOUR_IP_ADDRESS>:8000/api/v1/";
```

<hr>

### Credits
- [Coding Crashkurse](https://www.youtube.com/@codingcrashkurse6429)
- [freeCodeCamp.org](https://www.youtube.com/@freecodecamp)
- [Code for Interview](https://www.youtube.com/@codeforinterview)
