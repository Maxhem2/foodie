from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

class TodoCreate(BaseModel):
    title: str = Field(..., title='Title', max_length=55, min_length=1)
    description: str = Field(..., title='Title', max_length=755, min_length=1)
    expireDate: datetime = Field(..., title="ExpireDate" )
    
    
class TodoUpdate(BaseModel):
    title: Optional[str] = Field(..., title='Title', max_length=55, min_length=1)
    description: Optional[str] = Field(..., title='Title', max_length=755, min_length=1)
    expireDate: datetime = Field(..., title="ExpireDate")
    

class TodoOut(BaseModel):
    todo_id: UUID
    expireDate: datetime
    title: str
    description: str
    created_at: datetime
    updated_at: datetime
    