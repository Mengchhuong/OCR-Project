import { BACKEND_URL } from "./route";
/**
 * Uploads multiple files to the backend /uploadfile/ endpoint.
 * @param files - The FileList object from an <input type="file" multiple /> element.
 * @returns A promise that resolves to an array of [filename, filesize] pairs.
 */
export async function uploadFiles(files: FileList): Promise<[string, number][]> {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  const res = await fetch(`${BACKEND_URL}/uploadfile/`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return data.message;
}