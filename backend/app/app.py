# Importieren der erforderlichen Module und Klassen
from beanie import init_beanie
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

from app.api.api_v1.router import router
from app.core.config import settings
from app.models.item_model import Item
from app.models.user_model import User

# Erstellen einer FastAPI-Instanz mit Projektinformationen
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Hinzufügen von CORS-Middleware für Cross-Origin-Anfragen
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Event-Handler für den Start der Anwendung
@app.on_event("startup")
async def app_init():
    # Verbindung zur MongoDB-Datenbank herstellen
    db_client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING).ITEMLIST
    
    # Initialisieren der Beanie-Integration für MongoDB
    await init_beanie(
        database=db_client,
        document_models=[User, Item]
    )

# Einbinden des API-Routers mit dem angegebenen Präfix
app.include_router(router, prefix=settings.API_V1_STR)
