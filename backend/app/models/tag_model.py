from uuid import UUID, uuid4
from beanie import Document
from pydantic import Field


class Tag(Document):
    tag_id: UUID = Field(default_factory=uuid4, unique=True)
    name: str

    class Collection:
        name = "tags"