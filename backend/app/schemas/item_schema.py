from datetime import datetime
from typing import Optional, List, Union
from uuid import UUID
from pydantic import BaseModel, Field

class ItemCreate(BaseModel):
    title: str = Field(..., title='Title', max_length=55, min_length=1)
    description: str = Field(..., title='Description', max_length=755, min_length=1)
    expireDate: datetime = Field(..., title="ExpireDate")
    tag: Optional[str]

class ItemUpdate(BaseModel):
    title: Optional[str] = Field(..., title='Title', max_length=55, min_length=1)
    description: Optional[str] = Field(..., title='Description', max_length=755, min_length=1)
    expireDate: datetime = Field(..., title="ExpireDate")
    tag: Optional[UUID]

class ItemOut(BaseModel):
    item_id: UUID
    expireDate: datetime
    title: str
    description: str
    created_at: datetime
    updated_at: datetime
    tag: Optional[UUID]



 
