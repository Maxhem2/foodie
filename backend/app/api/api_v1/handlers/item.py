from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends
from app.models.user_model import User
from app.api.deps.user_deps import get_current_user
from app.schemas.item_schema import ItemOut, ItemCreate, ItemUpdate
from app.services.item_service import ItemService
from app.models.item_model import Item
from app.models.item_model import Tag

item_router = APIRouter()

@item_router.get('/', summary="Get all items of the user", response_model=List[ItemOut])
async def list(current_user: User = Depends(get_current_user)):
   items = await ItemService.list_items(current_user)

   for list_items in items:
    afd = list_items.item_id
    print("List: "+str(afd))
    if(await ItemService.isValidateDate(current_user=current_user, item_id=afd)) == True:
        print("IsValidate")
    else:   
        print("Error not Validate")
    
      
   return items


@item_router.post('/create', summary="Create Item", response_model=Item)
async def create_item(data: ItemCreate, current_user: User = Depends(get_current_user)):
    return await ItemService.create_item(current_user, data)


@item_router.get('/{item_id}', summary="Get a item by item_id", response_model=ItemOut)
async def retrieve(item_id: UUID, current_user: User = Depends(get_current_user)):
    return await ItemService.retrieve_item(current_user, item_id)


@item_router.put('/{item_id}', summary="Update item by item_id", response_model=ItemOut)
async def update(item_id: UUID, data: ItemUpdate, current_user: User = Depends(get_current_user)):
    return await ItemService.update_item(current_user, item_id, data)


@item_router.delete('/{item_id}', summary="Delete item by item_id")
async def delete(item_id: UUID, current_user: User = Depends(get_current_user)):
    await ItemService.delete_item(current_user, item_id)
    return None



@item_router.post('/create-tag', summary="Create Tag", response_model=Tag)
async def create_tag(tag_data: dict):
    return await ItemService.create_tag(tag_data)

@item_router.get('/list-tags', summary="List Tags", response_model=List[Tag])
async def list_tags():
    return await ItemService.list_tags()

@item_router.get('/retrieve-tag/{tag_id}', summary="Retrieve Tag", response_model=Tag)
async def retrieve_tag(tag_id: UUID):
    tag = await ItemService.retrieve_tag(tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag

@item_router.put('/update-tag/{tag_id}', summary="Update Tag", response_model=Tag)
async def update_tag(tag_id: UUID, tag_data: dict):
    tag = await ItemService.update_tag(tag_id, tag_data)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag

@item_router.delete('/delete-tag/{tag_id}', summary="Delete Tag")
async def delete_tag(tag_id: UUID):
    await ItemService.delete_tag(tag_id)
    return None

@item_router.get('/get-tags-for-item/{item_id}', summary="Get Tags for Item", response_model=List[Tag])
async def get_tags_for_item(item_id: UUID, current_user: User = Depends(get_current_user)):
    return await ItemService.get_tags_for_item(current_user, item_id)

@item_router.post('/add-tags-to-item/{item_id}', summary="Add Tags to Item", response_model=Item)
async def add_tags_to_item(item_id: UUID, tag_ids: List[UUID], current_user: User = Depends(get_current_user)):
    return await ItemService.add_tags_to_item(current_user, item_id, tag_ids)

@item_router.post('/remove-tags-from-item/{item_id}', summary="Remove Tags from Item", response_model=Item)
async def remove_tags_from_item(item_id: UUID, tag_ids: List[UUID], current_user: User = Depends(get_current_user)):
    return await ItemService.remove_tags_from_item(current_user, item_id, tag_ids)
