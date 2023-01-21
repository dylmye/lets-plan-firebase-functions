import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { initializeFirestore } from "firebase-admin/firestore";

import { setGlobalOptions } from "firebase-functions/v2";
import { firestore as listener } from "firebase-functions/v1";

const App = initializeApp({
  storageBucket: "lets-plan-firebase.appspot.com",
});

const firestore = initializeFirestore(App);

setGlobalOptions({
  timeoutSeconds: 540,
  memory: "2GiB",
});

/**
 * Delete items subcollection and firestore
 * images when the trip is deleted.
 */
export const removeRelatedOnTripDelete = listener
  .document("trips/{tripId}")
  .onDelete(async ({ data, ref }, { params }) => {
    console.debug(`🏓 Delete request for trip ID ${params.tripId} recieved.`);

    // if the user uploaded a cover image, this is its URL
    // looks like:
    // https://firebasestorage.googleapis.com/v0/b/lets-plan-firebase.appspot.com/o/trip-thumbs%2FTHE_FILE_NAME_HERE.EXTENSION?alt=media
    const storageUrl = data()?.image as string;

    if (storageUrl) {
      console.debug("📷 Trip image found. Deleting...");
      // splits into: ["https://firebasestorage.googleapis.com/v0/b/lets-plan-firebase.appspot.com/o/", "THE_FILE_NAME_HERE.EXTENSION?alt=media"]
      const split = storageUrl.split("trip-thumbs%2F");
      // splits into: ["THE_FILE_NAME_HERE.EXTENSION", "alt=media"]
      const finalSplit = split[1].includes("?")
        ? split[1].split("?")
        : [split[1]];

      const file = getStorage().bucket().file(`trip-thumbs/${finalSplit[0]}`);
      await file.delete();
      console.debug("✔ Deleted trip image successfully!");
    }

    await firestore.recursiveDelete(ref);
    console.debug("✔ Deleted the trip and subcollections successfully!");
    console.debug("🎉 Have a good day.");
  });
