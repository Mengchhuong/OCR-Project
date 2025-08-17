from fastapi import APIRouter, Form, status, HTTPException
from fastapi.responses import JSONResponse
from app.services.generate_ocr import generate_ocr_files, movebackfiles,generate_extract_json_url
import logging

from app.models.generated import Generated, GeneratedList

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/generateOCR", response_model= GeneratedList)
async def generateOCR(file_id: list[str] = Form(...)):
    try:
        ocr_result = await generate_ocr_files(file_id)
        generate_results = [Generated(file_id=r["file_id"], extract_detail=r["extract_detail"], confidence=r["confidence"], image_url=r["image_url"], file_name=r["file_name"]) for r in ocr_result]
        return GeneratedList(files=generate_results)
    except Exception as e:
        logger.exception("Error during OCR generation")
        return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/moveBackFile")
async def moveBackFile(file_id: list[str] = Form(...)):
    try:
        result = await movebackfiles(file_id)
        move_file = [r for r in result if not isinstance(r, Exception)]
        return JSONResponse(content=move_file)
    except Exception as e:
        logger.exception("Error during file move")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": str(e)}
        )

@router.post("/get_extract_json_url")
async def get_extract_json_url(file_id: str = Form(...)):
    try:
        extract_json_url = await generate_extract_json_url(file_id)
        return JSONResponse(content={"extract_json_url": extract_json_url})
    except Exception as e:
        logger.exception("Error during getting extract JSON URL")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": str(e)}
        )
