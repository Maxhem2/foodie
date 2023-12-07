from fastapi import APIRouter
from app.api.api_v1.handlers import user
from app.api.api_v1.handlers import item
from app.api.api_v1.handlers import tag
from app.api.auth.jwt import auth_router

router = APIRouter()

router.include_router(user.user_router, prefix='/users', tags=["users"])
router.include_router(item.item_router, prefix='/item', tags=["item"])
router.include_router(tag.tag_router, prefix='/tag', tags=["tag"])
router.include_router(auth_router, prefix='/auth', tags=["auth"])