import { db } from "./database";

/**
 * Queue an offline action (e.g. return inspection, form submission, note) in IndexedDB.
 * @param {object} actionParams
 * @param {string} actionParams.action - Descriptive name of the action
 * @param {string} actionParams.endpoint - API endpoint URL
 * @param {string} [actionParams.method="POST"] - HTTP method
 * @param {object} [actionParams.payload={}] - Payload object
 * @returns {Promise<number>} - Inserted item ID
 */
export async function queueOfflineAction({ action, endpoint, method = "POST", payload = {} }) {
  try {
    const id = await db.offlineQueue.add({
      action,
      endpoint,
      method,
      payload,
      timestamp: Date.now(),
      status: "PENDING",
    });
    return id;
  } catch (err) {
    console.warn("Failed to queue offline action:", err);
    return null;
  }
}

/**
 * Retrieves all pending offline queued actions.
 * @returns {Promise<Array>}
 */
export async function getPendingOfflineActions() {
  try {
    return await db.offlineQueue.where({ status: "PENDING" }).toArray();
  } catch {
    return [];
  }
}

/**
 * Processes queued offline actions when connectivity is restored.
 * Replays API requests to the backend.
 * @returns {Promise<{processed: number, failed: number}>}
 */
export async function processOfflineQueue() {
  let processed = 0;
  let failed = 0;

  try {
    const pendingActions = await getPendingOfflineActions();
    if (pendingActions.length === 0) {
      return { processed, failed };
    }

    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    for (const item of pendingActions) {
      try {
        const res = await fetch(item.endpoint, {
          method: item.method,
          headers,
          body: JSON.stringify(item.payload),
        });

        if (res.ok) {
          await db.offlineQueue.delete(item.id);
          processed++;
        } else {
          failed++;
        }
      } catch (err) {
        console.warn(`Error processing offline action ${item.id}:`, err);
        failed++;
      }
    }
  } catch (err) {
    console.warn("Failed during offline queue synchronization:", err);
  }

  return { processed, failed };
}

/**
 * Save form draft state to IndexedDB.
 * @param {string} id - Draft identifier
 * @param {string} type - Draft type (e.g., "rental_order", "inspection")
 * @param {object} data - Form data
 */
export async function saveFormDraft(id, type, data) {
  try {
    await db.drafts.put({
      id,
      type,
      data,
      updatedAt: Date.now(),
    });
  } catch (err) {
    console.warn("Failed to save draft:", err);
  }
}

/**
 * Retrieve form draft from IndexedDB.
 * @param {string} id - Draft identifier
 * @returns {Promise<object|null>}
 */
export async function getFormDraft(id) {
  try {
    const draft = await db.drafts.get(id);
    return draft ? draft.data : null;
  } catch {
    return null;
  }
}
