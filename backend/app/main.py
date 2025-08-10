from typing import List, Union

from fastapi import FastAPI, File, UploadFile
from fastapi import Request
from fastapi.responses import JSONResponse
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from supabase import create_client, Client
from typing import List
from dotenv import load_dotenv
load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.api_route("/", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
async def root_any_method(request: Request):
    return JSONResponse(content={"message": f"Hello from {request.method} on root!"})

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.post("/files/")
async def create_file(files: List[bytes] = File(...)):
    return {"file_sizes": [len(file) for file in files]}

@app.post("/uploadfile/")
async def upload_file(files: List[UploadFile] = File(...)):
    result = []

    for file in files:
        content = await file.read()
        file_path = file.filename

        # Delete old file if it exists
        try:
            supabase.storage.from_(SUPABASE_BUCKET).remove([file_path])
        except Exception:
            pass  # If file doesn't exist, ignore error

        # Upload new file
        try:
            supabase.storage.from_(SUPABASE_BUCKET).upload(file_path, content, {
                "content-type": file.content_type
            })
        except Exception as e:
            return JSONResponse(status_code=500, content={"error": f"Upload failed: {str(e)}"})

        # Get public URL
        try:
            public_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(file_path)
            result.append({"filename": file.filename, "url": public_url})
        except Exception as e:
            return JSONResponse(status_code=500, content={"error": f"Upload succeeded but URL failed: {str(e)}"})

    return {"files": result}

