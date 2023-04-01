import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { initializeFirestore } from "firebase-admin/firestore";

import { setGlobalOptions } from "firebase-functions/v2";
import { firestore as listener, auth } from "firebase-functions/v1";

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
    // can't deconstruct here, see https://stackoverflow.com/q/65725756
    .onDelete(async (document, { params }) => {
      console.debug(`🏓 Delete request for trip ID ${params.tripId} received.`);

      // if the user uploaded a cover image, this is its URL
      // looks like:
      // https://firebasestorage.googleapis.com/v0/b/lets-plan-firebase.appspot.com/o/trip-thumbs%2FTHE_FILE_NAME_HERE.EXTENSION?alt=media
      const storageUrl = document?.data()?.image as string;

      if (storageUrl) {
        console.debug("📷 Trip image found. Deleting...");
        // splits into: ["https://firebasestorage.googleapis.com/v0/b/lets-plan-firebase.appspot.com/o/", "THE_FILE_NAME_HERE.EXTENSION?alt=media"]
        const split = storageUrl.split("trip-thumbs%2F");
        // splits into: ["THE_FILE_NAME_HERE.EXTENSION", "alt=media"]
        const finalSplit = split[1].includes("?") ?
        split[1].split("?") :
        [split[1]];

        const file = getStorage().bucket().file(`trip-thumbs/${finalSplit[0]}`);
        await file.delete();
        console.debug("✔ Deleted trip image successfully!");
      } else {
        console.debug("🚫 No trip image found, continuing...");
      }

      await firestore.recursiveDelete(document?.ref);
      console.debug("✔ Deleted the trip and subcollections successfully!");
      console.debug("🎉 Have a good day.");
    });

export const deleteTripsOnUserDelete = auth.user().onDelete(async ({ uid }) => {
    console.debug(`🏓 Delete request for user ID ${uid} received.`);
    const usersTrips = await firestore.collection('trips').where('userId', '==', uid).get();
    console.debug(`🔎 Found ${usersTrips.size} trips for this user to delete....`);
    usersTrips.forEach(async (doc) => {
        await doc.ref.delete();
    });
    console.debug('✔ Deleted this user\'s trips successfully!');
    console.debug("🎉 Have a good day.");
});
