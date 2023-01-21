<p align="center">
  <a href="https://lets-plan.ninja">
    <img src="https://raw.githubusercontent.com/dylmye/lets-plan/main/logo.png" alt="Let's Plan logo" height="96">
  </a>
</p>

## Firebase Functions

A number of Firebase Gen 1 and Gen 2 Cloud Functions.

### Functions

* `removeRelatedOnTripDelete` - Triggered by trip delete. Deletes subcollections and, if uploaded, the Firebase Storage image (stored on the trip as `trip.image`)

## Setup

Set the `.firebaserc` file to use your firebase's project name. You need to enable the [Cloud Build API](https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com) to deploy from GitHub Actions.

To deploy functions when pushing to main branch, you'll need to set up the service account and workload identity federation as denoted in the [terraform configuration](https://github.com/dylmye/lets-plan-infra).

After you've set that up, set up these action secrets on your repo:

* `WORKLOAD_IDENTITY_PROVIDER`: The workload identity provider's "default audience", minus the iam.googleapis.com bit:

![](https://user-images.githubusercontent.com/7024578/213885829-f4d8dd4c-5ab0-4b1f-843e-2baaa9cc6f55.png)

* `SERVICE_ACCOUNT`: The email address service account you set up, e.g. `my-service-account@my-project.iam.gserviceaccount.com`
