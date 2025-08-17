from typing import List
import google.generativeai as genai
from datetime import date, datetime, timezone
from supabase import create_client, Client
import os
import logging
import json
import io
from dotenv import load_dotenv
from PIL import Image
from fastapi import UploadFile

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
SUPABASE_BUCKET_UPLOADS = os.environ.get("SUPABASE_BUCKET_UPLOADS")
SUPABASE_BUCKET_TEMP_UPLOADS = os.environ.get("SUPABASE_BUCKET_TEMP_UPLOADS")
SUPABASE_BUCKET_RESULT_IMAGES = os.environ.get("SUPABASE_BUCKET_RESULT_IMAGES")
SUPABASE_BUCKET_EXTRACT_TEXT = os.environ.get("SUPABASE_BUCKET_EXTRACT_TEXT")

if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL is not set in the environment variables.")
if not SUPABASE_KEY:
    raise ValueError("SUPABASE_KEY is not set in the environment variables.")
if not SUPABASE_BUCKET_EXTRACT_TEXT:
    raise ValueError("SUPABASE_BUCKET_EXTRACT_TEXT is not set in the environment variables.")

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

logger = logging.getLogger(__name__)

async def generate_ocr(file_id: str):
    """
    Generates OCR text from an image file (expected to be a birth certificate)
    using a configured Generative Model and formats the output according to
    the specific JSON schema for birth certificate details provided by the user.
    """
    model_name = os.getenv("GenerativeModel", "gemini-1.5-flash")
    model = genai.GenerativeModel(model_name)

    extracted_text_schema_template = {
        "city": "",
        "district": "",
        "commune": "",
        "certificate_number": "",
        "doc_number": "",
        "certificate_year": "",
        "last_name": "",
        "first_name": "",
        "last_name_latin": "",
        "first_name_latin": "",
        "gender": "",
        "nationality": "",
        "dob": "",
        "pob": "",
        "father_name": "",
        "mother_name": "",
        "father_name_latin": "",
        "mother_name_latin": "",
        "father_nationality": "",
        "mother_nationality": "",
        "father_dob": "",
        "mother_dob": "",
        "father_pob": "",
        "mother_pob": "",
        "first_pob_baby": "",
        "created_place": "",
        "created_date": "",
        "create_month": "",
        "create_year": "",
        "created_by": "",
        "signature": "",
        "confidence": ""
    }

    prompt_content = (
        "You are a highly accurate document processing system specialized in birth certificates. "
        "Your primary task is to extract all the specified details from the provided birth certificate image. "
        "Format the extracted data as a JSON array. Each object in this array represents "
        "the details of one birth certificate found in the image. "
        "Strictly adhere to the following JSON schema for each object:\n\n"
        f"```json\n{json.dumps(extracted_text_schema_template, indent=2)}\n```\n\n"
        "**Important Rules for Extraction:**\n"
        "1.  **All fields must be present:** Every field listed in the schema above MUST be included in your JSON output. "
        "    If a field's value is not found on the document or is not applicable, "
        "    set its value to an empty string (`\"\"`).\n"
        "2.  **No extra fields:** Do not include any fields that are not defined in the schema above.\n"
        "3.  **Strictly JSON output:** Provide only the JSON array. Do not include any conversational text, "
        "    markdown outside the JSON block, or explanations. Start your response directly with `[`.\n"
        "4.  **Accurate extraction & Formatting:** Extract the values precisely as they appear on the document. "
        "    Specifically for date fields:\n"
        "    -   `created_date`: Extract **only the day** (e.g., \"25\", \"01\").\n"
        "    -   `create_month`: Extract **only the khmer month** (e.g., \"តុលា\",\"មករា\").\n"
        "    -   `create_year`: Extract **only the year** (e.g., \"2023\").\n"
        "    If the full date is present, ensure you parse it correctly into these three fields.\n"
        "5.  **Latin names (if applicable):** For fields like 'last_name_latin', 'first_name_latin', "
        "    'father_name_latin', 'mother_name_latin', infer them from the primary name fields "
        "    if a Latin script equivalent is visible or easily transliterable. "
        "    If not explicitly present and cannot be inferred, set to `\"\"`.\n"
        "6.  **Gender:** Extract as khmer language 'ប្រុស', 'ស្រី', or `\"\"` if not found.\n"
        "7.  **Signature:** Indicate if a signature is present/visible (e.g., \"Present\") or `\"\"` if not discernible.\n"
        "8.  **Confidence:** Provide a confidence score between 0 and 100 give me after extract text how many confidence that you have (e.g., \"95\",\"75\") or `\"\"` if not applicable.\n"
        "Now, process the image and provide the JSON array containing the extracted birth certificate details."
    )

    try:
        
        """Change file location from temp to uploaded"""
        await change_file_upload(file_id)


        file_row = await get_image(file_id)
        if not file_row or "file_path" not in file_row:
            raise Exception("No file_path found for given file_id")
        image_path = file_row["file_path"]

        if image_path.startswith(f"{SUPABASE_BUCKET_UPLOADS}/"):
            image_path = image_path[len(f"{SUPABASE_BUCKET_UPLOADS}/"):]
        image_bytes = supabase_client.storage.from_(SUPABASE_BUCKET_UPLOADS).download(image_path)
        img = Image.open(io.BytesIO(image_bytes))

        response = await model.generate_content_async(
            contents=[prompt_content, img],
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.0
            )
        )

        extracted_data_list = []
        try:
            model_raw_text = response.text.strip()
            if model_raw_text.startswith('{') and model_raw_text.endswith('}'):
                parsed_single_object = json.loads(model_raw_text)
                extracted_data_list = [parsed_single_object]
            elif model_raw_text.startswith('[') and model_raw_text.endswith(']'):
                extracted_data_list = json.loads(model_raw_text)
            else:
                raise json.JSONDecodeError("Model response is not a valid JSON array or object", model_raw_text, 0)

            cleaned_extracted_data = []
            for item in extracted_data_list:
                cleaned_item = {}
                for key, default_value in extracted_text_schema_template.items():
                    value = item.get(key, default_value)
                    if not isinstance(value, str):
                        cleaned_item[key] = str(value)
                    else:
                        cleaned_item[key] = value
                cleaned_extracted_data.append(cleaned_item)

            extracted_data_list = cleaned_extracted_data

        except json.JSONDecodeError as e:
            print(f"JSON Decode Error after model response: {e}")
            print(f"Raw response text that caused error: '{response.text}'")
            extracted_data_list = [{key: "" for key in extracted_text_schema_template.keys()}]
        except Exception as e:
            print(f"Error during post-processing of model response: {e}")
            extracted_data_list = [{key: "" for key in extracted_text_schema_template.keys()}]
            
        is_success = False
        if extracted_data_list and len(extracted_data_list) > 0:
            first_doc = extracted_data_list[0]
            if first_doc.get("first_name") and first_doc.get("certificate_number"):
                is_success = True

        extract_detail_combined = (
            first_doc.get("first_name", "") + " " +
            first_doc.get("last_name", "") + " " +
            first_doc.get("gender", "") + " " +
            first_doc.get("dob", "")
        ).strip()
        
        words = extract_detail_combined.split()
        extract_detail = " ".join(words[:15])
        image_url = await get_image_url(file_id)
        final_response_json = {
                "file_id": file_id,
                "file_name": file_row["file_name"],
                "status": "Success" if is_success else "Failed",
                "extracted_text": extracted_data_list,
                "confidence": first_doc.get("confidence", 0.0),
                "extract_detail": extract_detail,
                "image_url": image_url,
        }
        json_bytes = json.dumps(final_response_json, indent=4, ensure_ascii=False).encode("utf-8")
        json_file_name = f"{file_id}.json"
        
        supabase_client.storage.from_(SUPABASE_BUCKET_EXTRACT_TEXT).upload(
            json_file_name,
            json_bytes,
            {"content-type": "application/json"}
        )
        logger.info(f"Uploaded JSON file: {json_file_name} to bucket {SUPABASE_BUCKET_EXTRACT_TEXT}")
        await change_database_status(file_id, "generated")
        return final_response_json
    except Exception as e:
        logger.error(f"OCR generation failed for {file_row["file_name"]}: {e}")
        print(f"An unexpected error occurred during OCR generation: {e}")
        await change_database_status(file_id, "failed")
        return {
                "file_name": "",
                "file_id": file_id,
                "status": "Failed",
                "extracted_text": [{key: "" for key in extracted_text_schema_template.keys()}],
                "extract_detail": "",
                "confidence": 0.0,
                "image_url": "",
        }

async def change_file_upload(file_id: str):
    """Moves file from temp bucket to uploads bucket and updates DB."""
    try:
        response = supabase_client.from_("public_files") \
            .select("file_path") \
            .eq("id", file_id) \
            .single() \
            .execute()

        if not response.data:
            raise Exception("No file found with given file_id")

        file_path = response.data["file_path"]
        if file_path.startswith(f"{SUPABASE_BUCKET_TEMP_UPLOADS}/"):
            file_path = file_path[len(f"{SUPABASE_BUCKET_TEMP_UPLOADS}/"):]

        file_data = supabase_client.storage.from_(SUPABASE_BUCKET_TEMP_UPLOADS).download(file_path)

        supabase_client.storage.from_(SUPABASE_BUCKET_UPLOADS).upload(file_path, file_data)

        supabase_client.storage.from_(SUPABASE_BUCKET_TEMP_UPLOADS).remove([file_path])

        logger.info(f"File {file_id} moved successfully.")
        
        """Change file path in table public_files"""
        try:
            supabase_client.from_("public_files") \
                .update({"file_path": f"{SUPABASE_BUCKET_UPLOADS}/{file_path}"}) \
                .eq("id", file_id) \
                .execute()
            if hasattr(response, "error") and response.error:
               raise Exception(f"Database update failed: {response.error}")
            logger.info(f"Database file_path updated successfully for file_id: {file_id}")
        except Exception as e:
            logger.error(f"Failed to update database for file_id {file_id}: {e}")

        return {"status": "success", "file_id": file_id, "message": "File moved successfully."}

    except Exception as e:
        logger.error(f"Failed {file_id} moved failed: {e}")
        return {"status": "error", "file_id": file_id, "error": str(e)}

async def change_database_status(file_id:str, status: str):
    """Updates the database record for the given file_id."""
    try:
        response = supabase_client.from_("public_files") \
            .update({"status": status}) \
            .eq("id", file_id) \
            .execute()

        if hasattr(response, "error") and response.error:
            raise Exception(f"Database update failed: {response.data}")
        logger.info(f"Database updated successfully for file_id: {file_id} with status {status}")
        
        if(status == "generated"):
            response = supabase_client.from_("public_files") \
                .update({"generated_at": json_serial(datetime.now(timezone.utc))}) \
                .eq("id", file_id) \
                .execute()
            if hasattr(response, "error") and response.error:
                raise Exception(f"Database update failed: {response.error}")
            
            logger.info(f"Database status updated to 'generated' for file_id: {file_id}")
            return {"status": "success", "file_id": file_id}    
        return {"status": "success", "file_id": file_id}
    

    except Exception as e:
        logger.error(f"Failed to update database for file_id {file_id}: {e}")
        return {"status": "error", "file_id": file_id, "error": str(e)}

async def generate_ocr_files(files: List[UploadFile]):
    """Processes multiple files for OCR extraction."""
    result = []
    for file in files:
        ocr_result = await generate_ocr(file)
        result.append(ocr_result)
    return result

async def get_image(file_id:str):
    """Fetches the image file from the uploads bucket."""
    try:
        response = supabase_client.from_("public_files") \
            .select("file_path","file_name") \
            .eq("id", file_id) \
            .single() \
            .execute()

        if not response.data:
            raise Exception("No file found with given file_id")
        if hasattr(response, "error"):
            raise Exception(f"Failed to download file: {response.error}")
        return response.data
    except Exception as e:
        logger.error(f"Error fetching image for file_id {file_id}: {e}")
        return None

async def get_image_url(file_id: str) -> str:
    response = (
        supabase_client
        .from_("public_files")
        .select("file_path")
        .eq("id", file_id)
        .single()
        .execute()
    )

    if not response.data:
        raise ValueError(f"No file found for file_id {file_id}")

    file_path = response.data["file_path"]
    if file_path.startswith(f"{SUPABASE_BUCKET_UPLOADS}/"):
        file_path = file_path[len(f"{SUPABASE_BUCKET_UPLOADS}/"):]

    signed = supabase_client.storage.from_(SUPABASE_BUCKET_UPLOADS).create_signed_url(file_path, expires_in=86400)

    if isinstance(signed, dict) and "signedURL" in signed:
        return signed["signedURL"]

    if isinstance(signed, str):
        return signed

    raise ValueError(f"Failed to generate signed URL for {file_id}")

async def generate_extract_json_url(file_id: str) -> str:
    """Generate a signed URL (valid for 1 day) for the extracted JSON file in Supabase bucket."""

    file_path = f"{file_id}.json"

    signed = supabase_client.storage.from_(SUPABASE_BUCKET_EXTRACT_TEXT).create_signed_url(
        file_path, expires_in=86400
    )

    if isinstance(signed, dict) and "signedURL" in signed:
        return signed["signedURL"]

    if isinstance(signed, str):
        return signed

    raise ValueError(f"Failed to generate signed URL for {file_id}")



def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError ("Type %s not serializable" % type(obj))

async def movebackfile(file_id: str):
    """Moves file from temp bucket to uploads bucket and updates DB."""
    try:
        response = supabase_client.from_("public_files") \
            .select("file_path") \
            .eq("id", file_id) \
            .single() \
            .execute()

        if not response.data:
            raise Exception("No file found with given file_id")

        file_path = response.data["file_path"]
        if file_path.startswith(f"{SUPABASE_BUCKET_UPLOADS}/"):
            file_path = file_path[len(f"{SUPABASE_BUCKET_UPLOADS}/"):]

        file_data = supabase_client.storage.from_(SUPABASE_BUCKET_UPLOADS).download(file_path)

        supabase_client.storage.from_(SUPABASE_BUCKET_TEMP_UPLOADS).upload(file_path, file_data)

        supabase_client.storage.from_(SUPABASE_BUCKET_UPLOADS).remove([file_path])

        logger.info(f"File {file_id} moved successfully.")
        
        try:
            update_response = supabase_client.from_("public_files") \
                .update({"file_path": f"{SUPABASE_BUCKET_TEMP_UPLOADS}/{file_path}","status":"uploaded","generated_at": None}) \
                .eq("id", file_id) \
                .execute()
            if hasattr(response, "error") and response.error:
                raise Exception(f"Database update failed: {update_response.data}")
            logger.info(f"Database file_path updated successfully for file_id: {file_id}")
        except Exception as e:
            logger.error(f"Failed to update database for file_id {file_id}: {e}")
        return {"status": "success", "file_id": file_id, "message": "File moved successfully."}

    except Exception as e:
        logger.error(f"Failed {file_id} moved failed: {e}")
        return {"status": "error", "file_id": file_id, "error": str(e)}

async def movebackfiles(file_ids: List[str]):
    """Moves multiple files from temp bucket to uploads bucket."""
    result = []
    for file_id in file_ids:
        ocr_result = await movebackfile(file_id)
        result.append(ocr_result)
    return result
