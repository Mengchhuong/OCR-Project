import { BACKEND_URL } from "./route";

/**
 * Uploads a single file to the backend with progress callback.
 * @param file - The file to upload.
 * @param onProgress - Callback for upload progress (0-100).
 * @returns A promise that resolves when upload is complete.
 */
export function uploadFileWithProgress(
  file: File,
  onProgress: (percent: number) => void
): Promise<{ filename: string; url: string, file_id: string, status: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("files", file);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.files && data.files.length > 0) {
            resolve(data.files[0]);
          } else {
            reject(new Error("No files returned from upload"));
          }
        } catch (e) {
          reject(e);
        }
      } else {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.open("POST", `${BACKEND_URL}/upload/uploadfile/`);
    xhr.send(formData);
  });
}

export function generateOCR(
  onProgress: (percent: number) => void,
  fileId: string
): Promise<{
  image_url: string;
  confidence: string;
  extract_detail: string;
  file_id: string;
  file_name: string;
}> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file_id", fileId);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          const file =
            data.files && Array.isArray(data.files) && data.files.length > 0
              ? data.files[0]
              : data;

          resolve({
            file_id: file.file_id,
            file_name: file.file_name,
            extract_detail: file.extract_detail ?? "",
            confidence: file.confidence ?? "",
            image_url: file.image_url,
          });
        } catch (e) {
          reject(e);
        }
      } else {
        reject(new Error("OCR generation failed"));
      }
    };

    xhr.onerror = () => reject(new Error("OCR generation failed"));
    xhr.open("POST", `${BACKEND_URL}/ocr/generateOCR`);
    xhr.send(formData);
  });
}

export function get_extract_json_url(fileId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file_id", fileId);

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data.extract_json_url);
        } catch (e) {
          reject(e);
        }
      } else {
        reject(new Error("Failed to get extract JSON URL"));
      }
    };

    xhr.onerror = () => reject(new Error("Failed to get extract JSON URL"));
    xhr.open("POST", `${BACKEND_URL}/ocr/get_extract_json_url`);
    xhr.send(formData);
  });
}
