from fastapi import APIRouter
from app.api.api_v1.handlers import user
from app.api.api_v1.handlers import item
from app.api.auth.jwt import auth_router

# Erstellen Sie einen APIRouter-Instanz
router = APIRouter()

# Fügen Sie den Benutzer-Router unter dem Präfix '/users' und mit dem Tag 'users' hinzu
router.include_router(user.user_router, prefix='/users', tags=["users"])

# Fügen Sie den Artikel-Router unter dem Präfix '/item' und mit dem Tag 'item' hinzu
router.include_router(item.item_router, prefix='/item', tags=["item"])

# Fügen Sie den Authentifizierungs-Router unter dem Präfix '/auth' und mit dem Tag 'auth' hinzu
router.include_router(auth_router, prefix='/auth', tags=["auth"])
