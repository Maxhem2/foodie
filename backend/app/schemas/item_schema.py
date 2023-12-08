from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

# Pydantic-Modell für die Erstellung eines Artikels
class ItemCreate(BaseModel):
    title: str = Field(..., title='Title', max_length=55, min_length=1)
    description: str = Field(..., title='Description', max_length=755, min_length=1)
    expireDate: datetime = Field(..., title="ExpireDate")

# Pydantic-Modell für die Aktualisierung eines Artikels
class ItemUpdate(BaseModel):
    title: Optional[str] = Field(..., title='Title', max_length=55, min_length=1)
    description: Optional[str] = Field(..., title='Description', max_length=755, min_length=1)
    expireDate: datetime = Field(..., title="ExpireDate")

# Pydantic-Modell für die Ausgabe eines Artikels
class ItemOut(BaseModel):
    item_id: UUID
    expireDate: datetime
    title: str
    description: str
    created_at: datetime
    updated_at: datetime
