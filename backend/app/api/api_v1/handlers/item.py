from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends
from app.models.user_model import User
from app.api.deps.user_deps import get_current_user
from app.schemas.item_schema import ItemOut, ItemCreate, ItemUpdate
from app.services.item_service import ItemService
from app.models.item_model import Item

# FastAPI-Router für die Item-Endpunkte
item_router = APIRouter()

# Endpunkt zum Abrufen aller Elemente des Benutzers
@item_router.get('/', summary="Get all items of the user", response_model=List[ItemOut])
async def list(current_user: User = Depends(get_current_user)):
    # Auflisten aller Elemente und Validieren der Ablaufdaten
    items = await ItemService.list_items(current_user)
    for list_items in items:
        afd = list_items.item_id
        print("List: "+str(afd))
        if (await ItemService.isValidateDate(current_user=current_user, item_id=afd)) == True:
            print("IsValidate")
        else:   
            print("Error not Validate")
    return items

# Endpunkt zum Erstellen eines neuen Elements
@item_router.post('/create', summary="Create Item", response_model=Item)
async def create_item(data: ItemCreate, current_user: User = Depends(get_current_user)):
    return await ItemService.create_item(current_user, data)

# Endpunkt zum Abrufen eines einzelnen Elements anhand der ID
@item_router.get('/{item_id}', summary="Get a item by item_id", response_model=ItemOut)
async def retrieve(item_id: UUID, current_user: User = Depends(get_current_user)):
    return await ItemService.retrieve_item(current_user, item_id)

# Endpunkt zum Aktualisieren eines Elements anhand der ID
@item_router.put('/{item_id}', summary="Update item by item_id", response_model=ItemOut)
async def update(item_id: UUID, data: ItemUpdate, current_user: User = Depends(get_current_user)):
    return await ItemService.update_item(current_user, item_id, data)

# Endpunkt zum Löschen eines Elements anhand der ID
@item_router.delete('/{item_id}', summary="Delete item by item_id")
async def delete(item_id: UUID, current_user: User = Depends(get_current_user)):
    await ItemService.delete_item(current_user, item_id)
    return None
