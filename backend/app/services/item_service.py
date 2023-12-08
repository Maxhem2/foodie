from typing import List
from uuid import UUID
from datetime import datetime
from app.models.user_model import User
from app.models.item_model import Item
from app.schemas.item_schema import ItemCreate, ItemUpdate

class ItemService:
    # Methode zum Abrufen einer Liste von Elementen für einen bestimmten Benutzer
    @staticmethod
    async def list_items(user: User) -> List[Item]:
        items = await Item.find(Item.owner.id == user.id).to_list()
        return items
    
    # Methode zum Erstellen eines neuen Elements für einen bestimmten Benutzer
    @staticmethod
    async def create_item(user: User, data: ItemCreate) -> Item:
        item = Item(**data.dict(), owner=user)
        return await item.insert()
    
    # Methode zum Abrufen eines einzelnen Elements für einen bestimmten Benutzer anhand der ID
    @staticmethod
    async def retrieve_item(current_user: User, item_id: UUID):
        item = await Item.find_one(Item.item_id == item_id, Item.owner.id == current_user.id)
        return item
    
    # Methode zum Aktualisieren eines Elements für einen bestimmten Benutzer anhand der ID
    @staticmethod
    async def update_item(current_user: User, item_id: UUID, data: ItemUpdate):
        item = await ItemService.retrieve_item(current_user, item_id)
        await item.update({"$set": data.dict(exclude_unset=True)})
        await item.save()
        return item
    
    # Methode zum Löschen eines Elements für einen bestimmten Benutzer anhand der ID
    @staticmethod
    async def delete_item(current_user: User, item_id: UUID) -> None:
        item = await ItemService.retrieve_item(current_user, item_id)
        if item:
            await item.delete()
        return None
    
    # Methode zum Überprüfen, ob das Ablaufdatum eines Elements noch nicht erreicht ist
    @staticmethod
    async def isValidateDate(current_user: User, item_id: UUID) -> None:
        item = await ItemService.retrieve_item(current_user, item_id)
        if item:
            # Berechnung der verbleibenden Zeit bis zum Ablaufdatum
            date = item.expireDate - datetime.utcnow()
            # Konvertierung der verbleibenden Zeit in Sekunden
            date = int(date.total_seconds())
            
            print("Date: "+str(date))
            
            # Überprüfung, ob das Ablaufdatum noch nicht erreicht ist
            if date > 0:
                return True
            else:
                return False
            
        return None
