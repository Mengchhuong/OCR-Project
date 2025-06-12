from typing import List, Union

from fastapi import FastAPI, File, UploadFile
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.post("/files/")
async def create_file(files: List[bytes] = File(...)):
    return {"file_sizes": [len(file) for file in files]}

@app.post("/uploadfile/")
async def create_upload_file(files: List[UploadFile] = File(...)):
    result = []
    os.makedirs("database/uploads", exist_ok=True)
    for file in files:
        file_location = f"database/uploads/{file.filename}"
        content = await file.read()
        with open(file_location, "wb") as f:
            f.write(content)
        result.append([file.filename, len(content)])
    return {"message": result}