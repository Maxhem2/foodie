from typing import List
from uuid import UUID
from app.models.user_model import User
from app.models.item_model import Item
from app.schemas.item_schema import ItemCreate, ItemUpdate

class ItemService:
    @staticmethod
    async def list_items(user: User) -> List[Item]:
        items = await Item.find(Item.owner.id == user.id).to_list()
        return items
    
    @staticmethod
    async def create_item(user: User, data: ItemCreate) -> Item:
        item = Item(**data.dict(), owner=user)
        return await item.insert()
    
    @staticmethod
    async def retrieve_item(current_user: User, item_id: UUID):
        item = await Item.find_one(Item.item_id == item_id, Item.owner.id == current_user.id)
        return item
    
    @staticmethod
    async def update_item(current_user: User, item_id: UUID, data: ItemUpdate):
        item = await ItemService.retrieve_item(current_user, item_id)
        await item.update({"$set": data.dict(exclude_unset=True)})
        
        await item.save()
        return item
    
    @staticmethod
    async def delete_item(current_user: User, item_id: UUID) -> None:
        item = await ItemService.retrieve_item(current_user, item_id)
        if item:
            await item.delete()
            
        return None

#Calculating remaining time and return false if the date is expired
    @staticmethod
    async def isValidateDate(current_user: User, item_id: UUID) -> None:
        item = await ItemService.retrieve_todo(current_user, item_id)
        if item:
            date = item.expireDate - datetime.utcnow()
            #convert date to int
            date = int(date.total_seconds())

            print("Date: "+str(date))
          
            if date > 0:
                return True
            else:
                return False
            
        return None
