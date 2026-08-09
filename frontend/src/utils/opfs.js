/**
 * Utility for Origin Private File System (OPFS) media buffering.
 * Stores raw media files (e.g. return inspection photos) locally in browser storage when offline.
 */

/**
 * Checks if OPFS is supported by the user's browser.
 * @returns {boolean}
 */
export function isOpfsSupported() {
  return typeof navigator !== "undefined" && !!navigator.storage?.getDirectory;
}

/**
 * Saves a Blob/File into the OPFS virtual directory.
 * @param {string} fileName - Destination filename
 * @param {Blob|File} blob - File binary data
 * @returns {Promise<boolean>}
 */
export async function saveFileToOpfs(fileName, blob) {
  if (!isOpfsSupported()) return false;
  try {
    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
    return true;
  } catch (err) {
    console.warn("Failed to write file to OPFS:", err);
    return false;
  }
}

/**
 * Retrieves a file Blob from OPFS.
 * @param {string} fileName - Target filename
 * @returns {Promise<File|null>}
 */
export async function getFileFromOpfs(fileName) {
  if (!isOpfsSupported()) return null;
  try {
    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle(fileName);
    return await fileHandle.getFile();
  } catch (err) {
    console.warn("Failed to read file from OPFS:", err);
    return null;
  }
}

/**
 * Deletes a file from OPFS.
 * @param {string} fileName - Target filename
 */
export async function deleteFileFromOpfs(fileName) {
  if (!isOpfsSupported()) return;
  try {
    const root = await navigator.storage.getDirectory();
    await root.removeEntry(fileName);
  } catch (err) {
    console.warn("Failed to remove file from OPFS:", err);
  }
}
