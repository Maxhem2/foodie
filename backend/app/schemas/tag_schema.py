from typing import Optional
from uuid import UUID
from pydantic import BaseModel


class TagCreate(BaseModel):
    tag_id: UUID
    name: str
class TagUpdate(BaseModel):
    tag_id: UUID
    name: Optional[str]
class TagOut(BaseModel):
    tag_id: UUID
    name: Optional[str]
