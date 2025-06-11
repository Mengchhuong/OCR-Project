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
): Promise<[string, number]> {
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
        // Parse response and return filename and size
        try {
          const data = JSON.parse(xhr.responseText);
          // data.message is an array of [filename, filesize], but we upload one file
          resolve(data.message[0]);
        } catch (e) {
          reject(e);
        }
      } else {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.open("POST", `${BACKEND_URL}/uploadfile/`);
    xhr.send(formData);
  });
}