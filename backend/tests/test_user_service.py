from fastapi.testclient import TestClient
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
import pytest

from app.app import app
from app.core.config import settings
from app.models.user_model import User

@pytest.fixture
async def test_app():
    # Seperate MongoDB-Datenbank für Tests
    test_db_name = "test_db"
    test_db_client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING)[test_db_name]
    
    # Initialisierung mit der Testdatenbank
    await init_beanie(
        database=test_db_client,
        document_models=[User],
    )
    
    # MongoDB-Verbindung der App für die Verwendung der Testdatenbank
    settings.MONGO_CONNECTION_STRING = settings.MONGO_CONNECTION_STRING.replace(
        settings.MONGO_DB_NAME, test_db_name
    )

    # Erstellen eines Test-Clients
    async with TestClient(app) as test_client:
        yield test_client  # Stelle den Test-Client für Tests bereit

    # Aufräumen: Löschen der Testdatenbank nach allen Tests
    await test_db_client.drop_database(test_db_name)

# Test für die Benutzererstellung erstellen
async def test_create_user(test_app):
    email = "user1@gmail.com"
    password = "user123"
    user_data = {"email": email, "password": password}

    # Test: Sendet Anfrage zur Erstellung eines Benutzers
    response = await test_app.post("/api/v1/users/create", json=user_data)

    # Überprüft die Antwort
    assert response.status_code == 201
    created_user = response.json()
    assert created_user["email"] == email
