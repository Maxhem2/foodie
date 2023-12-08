from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from beanie import Document, Indexed, Link, before_event, Replace, Insert
from pydantic import Field
from .user_model import User

# Definition des Beanie-Dokuments für ein Element (Item)
class Item(Document):
    # Felder für das Element
    item_id: UUID = Field(default_factory=uuid4, unique=True)
    expireDate: datetime = Field(default=datetime.utcnow())
    title: Indexed(str)
    description: str = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    owner: Link[User]
    
    # Methode zur Darstellung des Elements
    def __repr__(self) -> str:
        return f"<Item {self.title}>"

    # Methode zur String-Repräsentation des Elements
    def __str__(self) -> str:
        return self.title

    # Methode zum Festlegen des Hash-Werts für das Element
    def __hash__(self) -> int:
        return hash(self.title)

    # Methode zur Überprüfung der Gleichheit zwischen zwei Elementen
    def __eq__(self, other: object) -> bool:
        if isinstance(other, Item):
            return self.item_id == other.item_id
        return False
    
    # Event-Hook: Vor dem Ersetzen oder Einfügen aktualisiere das `updated_at`-Feld
    @before_event([Replace, Insert])
    def update_updated_at(self):
        self.updated_at = datetime.utcnow()
        
    # Klasse für die Kollektionseinstellungen
    class Collection:
        name = "items"
