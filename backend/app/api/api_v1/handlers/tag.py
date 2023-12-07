
from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.api.deps.user_deps import get_current_user
from app.models.item_model import Item, Tag
from app.models.user_model import User
from app.services.item_service import ItemService

tag_router = APIRouter()

@tag_router.post('/create-tag', summary="Create Tag", response_model=Tag)
async def create_tag(tag_data: dict):
    return await ItemService.create_tag(tag_data)

@tag_router.get('/list-tags', summary="List Tags", response_model=List[Tag])
async def list_tags():
    return await ItemService.list_tags()

@tag_router.get('/retrieve-tag/{tag_id}', summary="Retrieve Tag", response_model=Tag)
async def retrieve_tag(tag_id: UUID):
    tag = await ItemService.retrieve_tag(tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag

@tag_router.put('/update-tag/{tag_id}', summary="Update Tag", response_model=Tag)
async def update_tag(tag_id: UUID, tag_data: dict):
    tag = await ItemService.update_tag(tag_id, tag_data)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag

@tag_router.delete('/delete-tag/{tag_id}', summary="Delete Tag")
async def delete_tag(tag_id: UUID):
    await ItemService.delete_tag(tag_id)
    return None

@tag_router.get('/get-tags-for-item/{item_id}', summary="Get Tags for Item", response_model=List[Tag])
async def get_tags_for_item(item_id: UUID, current_user: User = Depends(get_current_user)):
    return await ItemService.get_tags_for_item(current_user, item_id)

@tag_router.post('/add-tags-to-item/{item_id}', summary="Add Tags to Item", response_model=Item)
async def add_tags_to_item(item_id: UUID, tag_ids: List[UUID], current_user: User = Depends(get_current_user)):
    return await ItemService.add_tags_to_item(current_user, item_id, tag_ids)

@tag_router.post('/remove-tags-from-item/{item_id}', summary="Remove Tags from Item", response_model=Item)
async def remove_tags_from_item(item_id: UUID, tag_ids: List[UUID], current_user: User = Depends(get_current_user)):
    return await ItemService.remove_tags_from_item(current_user, item_id, tag_ids)
