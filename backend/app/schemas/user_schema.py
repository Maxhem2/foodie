from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field

# Pydantic-Modell für die Authentifizierung eines Benutzers
class UserAuth(BaseModel):
    email: EmailStr = Field(..., description="User email")
    username: str = Field(..., min_length=5, max_length=50, description="User username")
    password: str = Field(..., min_length=5, max_length=24, description="User password")

# Pydantic-Modell für die Ausgabe von Benutzerinformationen
class UserOut(BaseModel):
    user_id: UUID
    username: str
    email: EmailStr
    first_name: Optional[str]
    last_name: Optional[str]
    disabled: Optional[bool] = False

# Pydantic-Modell für die Aktualisierung von Benutzerinformationen
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
