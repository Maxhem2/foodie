from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from beanie import Document, Indexed, Link, before_event, Replace, Insert
from pydantic import Field
from .user_model import User

class Item(Document):
    item_id: UUID = Field(default_factory=uuid4, unique=True)
    expireDate: datetime = Field(default=datetime.utcnow())
    title: Indexed(str)
    description: str = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    owner: Link[User]
    
    def __repr__(self) -> str:
        return f"<Item {self.title}>"

    def __str__(self) -> str:
        return self.title

    def __hash__(self) -> int:
        return hash(self.title)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Item):
            return self.item_id == other.item_id
        return False
    
    @before_event([Replace, Insert])
    def update_update_at(self):
        self.updated_at = datetime.utcnow()
        
    
    class Collection:
        name = "items"