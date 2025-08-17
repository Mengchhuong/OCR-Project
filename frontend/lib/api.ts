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

export function generateOCR(onProgress: (percent: number) => void, fileIds: string[]): Promise<{ files: Array<{ file_id: string; extract_detail: string; confidence: number | string; image_url: string}> }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    fileIds.forEach((id) => formData.append("file_id", id));
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
          resolve(data);
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
