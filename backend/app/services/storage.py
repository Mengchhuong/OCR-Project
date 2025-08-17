import os
from fastapi import UploadFile, HTTPException, status
from supabase import create_client, Client
from typing import List
from dotenv import load_dotenv
import logging
import re
import uuid
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
SUPABASE_BUCKET_UPLOADS = os.environ.get("SUPABASE_BUCKET_UPLOADS")
SUPABASE_BUCKET_TEMP_UPLOADS = os.environ.get("SUPABASE_BUCKET_TEMP_UPLOADS")

if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL is not set in the environment variables.")
if not SUPABASE_KEY:
    raise ValueError("SUPABASE_KEY is not set in the environment variables.")
if not SUPABASE_BUCKET_TEMP_UPLOADS:
    raise ValueError("SUPABASE_BUCKET_TEMP_UPLOADS is not set in the environment variables.")

supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

logger = logging.getLogger(__name__)

def make_safe_file_name(original_name: str) -> str:
    """
    Convert a filename to a safe version with a UUID prefix.
    Replaces spaces with underscores, removes unsafe characters,
    and adds a unique UUID to avoid collisions.
    """
    sanitized = original_name.strip().lower()
    sanitized = re.sub(r"\s+", "_", sanitized)
    sanitized = re.sub(r"[^a-z0-9._-]", "", sanitized)
    return f"{uuid.uuid4()}_{sanitized}"

async def upload_file_to_supabase(file: UploadFile):
    """Uploads a single file to Supabase temp storage and logs metadata in Postgres."""
    try:
        content = await file.read()
        file_path = make_safe_file_name(file.filename)

        try:
            supabase_client.storage.from_(SUPABASE_BUCKET_TEMP_UPLOADS).upload(
                file_path, content, {"content-type": file.content_type}
            )
            logger.info(f"Uploaded file: {file_path} to bucket {SUPABASE_BUCKET_TEMP_UPLOADS}")
        except Exception as upload_err:
            logger.error(f"Upload failed for {file_path}: {upload_err}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Upload failed: {str(upload_err)}"
            )

        try:
            public_url = supabase_client.storage.from_(SUPABASE_BUCKET_TEMP_UPLOADS).get_public_url(file_path)
            logger.info(f"Generated public URL for {file_path}: {public_url}")

        except Exception as url_err:
            logger.error(f"Could not generate public URL for {file_path}: {url_err}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Upload succeeded but URL failed: {str(url_err)}"
            )

        try:
            size = len(content)
            data = {
                "file_path": f"{SUPABASE_BUCKET_TEMP_UPLOADS}/{file_path}",
                "file_name": file.filename,
                "size": size,
                "status": "uploaded"
            }
            response = supabase_client.table("public_files").insert(data).execute()
            if not response.data:
                raise Exception("Database insert failed")

            db_row = response.data[0]
            logger.info(f"Inserted metadata for {file_path} into database: {db_row}")

        except Exception as db_err:
            logger.error(f"Database insert failed for {file_path}: {db_err}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Upload succeeded but DB insert failed: {str(db_err)}"
            )

        return {
            "id": db_row["id"],
            "file_path": db_row["file_path"],
            "file_name": file.filename,
            "url": public_url,
            "status": db_row["status"],
            "created_at": db_row["created_at"]
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        logger.exception(f"Unexpected error during upload of {file.filename}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )


async def upload_files_temp_to_supabase(files: List[UploadFile]):
    """Uploads multiple files to Supabase temp storage and logs to Postgres."""
    results = []
    for file in files:
        result = await upload_file_to_supabase(file)
        results.append(result)
    return results
