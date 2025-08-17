from typing import List
from pydantic import BaseModel

class UploadResult(BaseModel):
    file_id: str
    file_name: str
    status: str

class UploadResponse(BaseModel):
    files: List[UploadResult]
    
