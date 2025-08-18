from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import generate_ocr_route, upload_route

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://fastapi-backend-k0up.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_route.router, prefix="/upload", tags=["Upload"])
app.include_router(generate_ocr_route.router, prefix="/ocr", tags=["OCR"])

@app.api_route("/", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
async def root():
    return {"message": "API is running"}