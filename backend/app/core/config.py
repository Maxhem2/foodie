from typing import List

from decouple import config
from pydantic import AnyHttpUrl, BaseSettings

# Definieren einer Klasse für die Anwendungseinstellungen, die von BaseSettings erbt
class Settings(BaseSettings):
    # Standardwerte für verschiedene Einstellungen
    API_V1_STR: str = "/api/v1"
    JWT_SECRET_KEY: str = config("JWT_SECRET_KEY", cast=str)
    JWT_REFRESH_SECRET_KEY: str = config("JWT_REFRESH_SECRET_KEY", cast=str)
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7   # 7 Tage
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000"
    ]
    PROJECT_NAME: str = "ITEMLIST"
    
    # Datenbankverbindungszeichenfolge für MongoDB
    MONGO_CONNECTION_STRING: str = config("MONGO_CONNECTION_STRING", cast=str)
    
    class Config:
        case_sensitive = True

# Instanziieren der Einstellungen, um auf die Werte zuzugreifen
settings = Settings()
