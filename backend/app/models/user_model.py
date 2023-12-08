from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from beanie import Document, Indexed
from pydantic import Field, EmailStr

# Definition des Beanie-Dokuments für einen Benutzer
class User(Document):
    # Felder für den Benutzer
    user_id: UUID = Field(default_factory=uuid4)
    username: Indexed(str, unique=True)
    email: Indexed(EmailStr, unique=True)
    hashed_password: str
    first_name: Optional[str] = None 
    last_name: Optional[str] = None
    disabled: Optional[bool] = None
    
    # Methode zur Darstellung des Benutzers
    def __repr__(self) -> str:
        return f"<User {self.email}>"

    # Methode zur String-Repräsentation des Benutzers
    def __str__(self) -> str:
        return self.email

    # Methode zum Festlegen des Hash-Werts für den Benutzer
    def __hash__(self) -> int:
        return hash(self.email)

    # Methode zur Überprüfung der Gleichheit zwischen zwei Benutzern
    def __eq__(self, other: object) -> bool:
        if isinstance(other, User):
            return self.email == other.email
        return False
    
    # Property-Methode zum Abrufen des Erstellungsdatums des Benutzers
    @property
    def created(self) -> datetime:
        return self.id.generation_time
    
    # Klassenmethode zum Abrufen eines Benutzers anhand der E-Mail-Adresse
    @classmethod
    async def by_email(cls, email: str) -> "User":
        return await cls.find_one(cls.email == email)
    
    # Klasse für die Kollektionseinstellungen
    class Collection:
        name = "users"
