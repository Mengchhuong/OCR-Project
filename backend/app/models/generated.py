from typing import List, Optional
from pydantic import BaseModel

class Generated(BaseModel):
    file_name: str
    file_id: str
    extract_detail: str
    confidence: str
    image_url: Optional[str] = None

class GeneratedList(BaseModel):
    files : List[Generated]