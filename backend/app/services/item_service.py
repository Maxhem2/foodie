from typing import List
from uuid import UUID
from datetime import datetime
import uuid
from app.models.user_model import User
from app.models.item_model import Item
from app.models.item_model import Tag  # Import the Tag model
from app.schemas.item_schema import ItemCreate, ItemUpdate

class ItemService:
    @staticmethod
    async def list_items(user: User) -> List[Item]:
        items = await Item.find(Item.owner.id == user.id).to_list()
        return items
    
    @staticmethod
    async def create_item(user: User, data: ItemCreate) -> Item:
        if data.tag is not None and data.tag != "":
            print(data.tag)
            uuId = uuid.UUID(data.tag)
            x = await ItemService.retrieve_tag(uuId)
            print(type(x))
            print(x)
            item = Item(**data.dict(), owner=user)
            item.tag = x
            # item.tag = tag  # Set the tag attribute separately
        else:
            item = Item(**data.dict(), owner=user)

        await item.insert()

        return item
    
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
    
    @staticmethod
    async def create_tag(name:str) -> Tag:
        tag = Tag(**name)
        return await tag.insert()

    @staticmethod
    async def create_tags(tag_data_list: List[str]) -> List[Tag]:
        tags = [Tag(**tag_data) for tag_data in tag_data_list]
        return await Tag.insert_many(tags)

    @staticmethod
    async def list_tags() -> List[Tag]:
        tags = await Tag.all().to_list()
        return tags

    @staticmethod
    async def retrieve_tag(tag_id: UUID) -> Tag:
        tag = await Tag.find_one(Tag.tag_id == tag_id)
        return tag
    
    @staticmethod
    async def get_tags_for_item(current_user: User, item_id: UUID) -> List[Tag]:
        item = await ItemService.retrieve_item(current_user, item_id)
        if item:
            tags = await Tag.find(Tag.tag_id.in_([tag.tag_id for tag in item.tags])).to_list()
            return tags
        return []
    
    @staticmethod
    async def update_tag(tag_id: UUID, name: str) -> Tag:
        tag = await ItemService.retrieve_tag(tag_id)
        if tag:
            await tag.update({"$set": name})
            await tag.save()
        return tag

    @staticmethod
    async def delete_tag(tag_id: UUID) -> None:
        tag = await ItemService.retrieve_tag(tag_id)
        if tag:
            await tag.delete()


    @staticmethod
    async def add_tags_to_item(current_user: User, item_id: UUID, tag_ids: List[UUID]) -> Item:
        item = await ItemService.retrieve_item(current_user, item_id)
        if item:
            tags = await Tag.find(Tag.tag_id.in_(tag_ids)).to_list()
            item.tags.extend(tags)
            await item.save()
        return item

    @staticmethod
    async def remove_tags_from_item(current_user: User, item_id: UUID, tag_ids: List[UUID]) -> Item:
        item = await ItemService.retrieve_item(current_user, item_id)
        if item:
            item.tags = [tag for tag in item.tags if tag.tag_id not in tag_ids]
            await item.save()
        return item

    # Remaining time validation method
    #Calculating remaining time and return false if the date is expired
    @staticmethod
    async def isValidateDate(current_user: User, item_id: UUID) -> None:
        item = await ItemService.retrieve_item(current_user, item_id)
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
