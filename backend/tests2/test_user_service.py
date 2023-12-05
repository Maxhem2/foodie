# tests2/test_user_service.py
from unittest.mock import AsyncMock, patch
from app.api.api_v1.handlers.user import create_user
from app.services.user_service import UserService
from app.models.user_model import User
from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.core.config import settings
import pytest

@pytest.fixture
def app():
    return FastAPI()

@pytest.fixture
async def test_app(app):
    async with TestClient(app) as test_client:
        yield test_client

@pytest.mark.asyncio
async def test_create_user(mocker, test_app):
    # Mock the UserService.create_user method
    mocker.patch.object(UserService, "create_user", return_value={"email": "user1@gmail.com"})

    # Test data: Replace with appropriate test data
    email = "user1@gmail.com"
    password = "user123"
    user_data = {"email": email, "password": password}

    # Test: Call the create_user function directly
    with patch("app.api.api_v1.handlers.user.UserService.create_user", new_callable=AsyncMock) as mock_create_user:
        await create_user(user_data)

    # Assertions: Verify the response
    mock_create_user.assert_called_once_with(user_data)
