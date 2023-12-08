from typing import Optional
from uuid import UUID
from app.schemas.user_schema import UserAuth
from app.models.user_model import User
from app.core.security import get_password, verify_password
import pymongo

from app.schemas.user_schema import UserUpdate


class UserService:

    # Methode zum Abrufen eines Benutzers anhand der Benutzer-ID
    @staticmethod
    async def retrieve_user(user_id: UUID):
        user = await User.find_one(User.user_id == user_id)
        return user

    # Methode zum Löschen eines Benutzers
    @staticmethod
    async def delete_user(current_user: User) -> None:
        user = await UserService.retrieve_user(current_user.user_id)
        if user:
            await user.delete()

        return None

    # Methode zum Erstellen eines neuen Benutzers
    @staticmethod
    async def create_user(user: UserAuth):
        user_in = User(
            username=user.username,
            email=user.email,
            hashed_password=get_password(user.password)
        )
        await user_in.save()
        return user_in

    # Methode zur Authentifizierung eines Benutzers anhand von E-Mail und Passwort
    @staticmethod
    async def authenticate(email: str, password: str) -> Optional[User]:
        user = await UserService.get_user_by_email(email=email)
        if not user:
            return None
        if not verify_password(password=password, hashed_pass=user.hashed_password):
            return None

        return user

    # Methode zum Abrufen eines Benutzers anhand der E-Mail-Adresse
    @staticmethod
    async def get_user_by_email(email: str) -> Optional[User]:
        user = await User.find_one(User.email == email)
        return user

    # Methode zum Abrufen eines Benutzers anhand der Benutzer-ID
    @staticmethod
    async def get_user_by_id(id: UUID) -> Optional[User]:
        user = await User.find_one(User.user_id == id)
        return user

    # Methode zum Aktualisieren eines Benutzers
    @staticmethod
    async def update_user(id: UUID, data: UserUpdate) -> User:
        user = await User.find_one(User.user_id == id)
        if not user:
            raise pymongo.errors.OperationFailure("User not found")

        await user.update({"$set": data.dict(exclude_unset=True)})
        return user
