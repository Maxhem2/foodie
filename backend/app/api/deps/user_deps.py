from datetime import datetime
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings
from app.models.user_model import User
from jose import jwt
from pydantic import ValidationError
from app.services.user_service import UserService
from app.schemas.auth_schema import TokenPayload

# OAuth2PasswordBearer-Objekt für die Token-Authentifizierung erstellen
reuseable_oauth = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login",
    scheme_name="JWT"
)

# Funktion zum Abrufen des aktuellen Benutzers anhand des mitgelieferten Tokens
async def get_current_user(token: str = Depends(reuseable_oauth)) -> User:
    try:
        # Token entschlüsseln und Payload überprüfen
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        
        # Überprüfen, ob der Token abgelaufen ist
        if datetime.fromtimestamp(token_data.exp) < datetime.now():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except (jwt.JWTError, ValidationError):
        # Behandlung von Fehlern bei der Token-Entschlüsselung oder Validierung
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Benutzer anhand der Benutzer-ID im Token abrufen
    user = await UserService.get_user_by_id(token_data.sub)
    
    # Überprüfen, ob der Benutzer gefunden wurde
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find user",
        )
    
    # Rückgabe des gefundenen Benutzers
    return user
