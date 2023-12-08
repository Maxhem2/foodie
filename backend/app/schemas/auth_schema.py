from uuid import UUID
from pydantic import BaseModel

# Pydantic-Modell für ein Token-Schema
class TokenSchema(BaseModel):
    # Feld für den Zugriffstoken
    access_token: str
    # Feld für den Aktualisierungstoken
    refresh_token: str
    
# Pydantic-Modell für den Payload eines Tokens
class TokenPayload(BaseModel):
    # Feld für die Benutzer-ID (Subjekt)
    sub: UUID = None
    # Feld für das Ablaufdatum des Tokens (Expiration Time)
    exp: int = None
