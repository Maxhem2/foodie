from fastapi import APIRouter, HTTPException, status
from app.schemas.user_schema import UserAuth, UserOut, UserUpdate
from fastapi import Depends
from app.services.user_service import UserService
import pymongo
from app.models.user_model import User
from app.api.deps.user_deps import get_current_user
from uuid import UUID

# Erstellen eines FastAPI-Routers für die Benutzer-Endpunkte
user_router = APIRouter()

# Endpunkt zum Erstellen eines neuen Benutzers
@user_router.post('/create', summary="Create new user", response_model=UserOut)
async def create_user(data: UserAuth):
    try:
        # Versuch, einen neuen Benutzer zu erstellen
        return await UserService.create_user(data)
    except pymongo.errors.DuplicateKeyError:
        # Behandlung eines Fehlers, wenn ein Benutzer mit derselben E-Mail oder Benutzernamen bereits existiert
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exists"
        )

# Endpunkt zum Löschen des aktuellen Benutzers
@user_router.delete('/delete', summary="Delete user by user_id")
async def delete(current_user: User = Depends(get_current_user)):
    # Löschen des aktuellen Benutzers
    await UserService.delete_user(current_user)
    return None

# Endpunkt zum Abrufen der Details des aktuell angemeldeten Benutzers
@user_router.get('/me', summary='Get details of currently logged in user', response_model=UserOut)
async def get_me(user: User = Depends(get_current_user)):
    return user

# Endpunkt zum Aktualisieren der Benutzerdaten
@user_router.post('/update', summary='Update User', response_model=UserOut)
async def update_user(data: UserUpdate, user: User = Depends(get_current_user)):
    try:
        # Versuch, die Benutzerdaten zu aktualisieren
        return await UserService.update_user(user.user_id, data)
    except pymongo.errors.OperationFailure:
        # Behandlung eines Fehlers, wenn der Benutzer nicht existiert
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not exist"
        )
