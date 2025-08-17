from typing import List

from fastapi import APIRouter, UploadFile, File, HTTPException, status

from app.services.storage import upload_files_temp_to_supabase
from app.models.upload import UploadResponse, UploadResult

router = APIRouter()

@router.post("/uploadfile", response_model=UploadResponse)
async def upload_files(files: List[UploadFile] = File(...)):
    """Uploads multiple files to Supabase storage."""
    try:
        result = await upload_files_temp_to_supabase(files)
        upload_results = [UploadResult(file_id=r["id"], file_name=r["file_name"], status=r["status"]) for r in result]
        return UploadResponse(files=upload_results)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))