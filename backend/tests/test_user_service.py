# tests/test_user_service.py

from fastapi.testclient import TestClient
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
import pytest

from app.app import app
from app.core.config import settings
from app.models.user_model import User


@pytest.fixture
async def test_app():
    # Use a separate MongoDB database for testing
    test_db_name = "test_db"
    test_db_client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING)[test_db_name]
    
    # Initialize Beanie with the test database
    await init_beanie(
        database=test_db_client,
        document_models=[User],
    )
    
    # Modify the app's MongoDB connection string to use the test database
    settings.MONGO_CONNECTION_STRING = settings.MONGO_CONNECTION_STRING.replace(
        settings.MONGO_DB_NAME, test_db_name
    )

    # Create a test client with the modified app
    async with TestClient(app) as test_client:
        yield test_client  # Provide the test client to tests

    # Clean up: Drop the test database after all tests
    await test_db_client.drop_database(test_db_name)


async def test_create_user(test_app):
    # Test data: Replace with appropriate test data
    email = "user1@gmail.com"
    password = "user123"
    user_data = {"email": email, "password": password}

    # Test: Send a request to create a user
    response = await test_app.post("/api/v1/users/create", json=user_data)

    # Assertions: Verify the response
    assert response.status_code == 201
    created_user = response.json()
    assert created_user["email"] == email
