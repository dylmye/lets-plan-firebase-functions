<p align="center">
  <a href="https://lets-plan.ninja">
    <img src="https://raw.githubusercontent.com/dylmye/lets-plan/main/logo.png" alt="Let's Plan logo" height="96">
  </a>
</p>

<p align="center">
  <a href="https://github.com/dylmye/lets-plan-firebase-functions/actions/workflows/deploy-firebase-functions.yml"><img alt="The status badge for this project's build" src="https://img.shields.io/github/actions/workflow/status/dylmye/lets-plan-firebase-functions/deploy-firebase-functions.yml?logo=github"></a>
  <a href="https://app.fossa.com/projects/git%2Bgithub.com%2Fdylmye%2Flets-plan-firebase-functions?ref=badge_shield"><img alt="FOSSA status" src="https://app.fossa.com/api/projects/git%2Bgithub.com%2Fdylmye%2Flets-plan-firebase-functions.svg?type=shield"></a>
  <a href="https://snyk.io"><img alt="The status badge for the Snyk-detected vulnerabilities count for this project" src="https://img.shields.io/snyk/vulnerabilities/github/dylmye/lets-plan-firebase-functions/functions/package.json.svg?logo=snyk"></a>
</p>

<p align="center">
    <a href="https://github.com/dylmye/lets-plan">Webapp</a> •
    <a href="https://github.com/dylmye/lets-plan-infra">Infrastructure</a> •
    <strong>Firebase Functions</strong>
</p>

---

## Firebase Functions

A number of Firebase Gen 1 and Gen 2 Cloud Functions.

### Functions

-   `removeRelatedOnTripDelete` - Triggered by trip delete. Deletes subcollections and, if uploaded, the Firebase Storage image (stored on the trip as `trip.image`)

## Setup

Set the `.firebaserc` file to use your firebase's project name. You need to enable the [Cloud Build API](https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com) and the [Artifact Registry API](https://console.cloud.google.com/apis/library/artifactregistry.googleapis.com) to deploy from GitHub Actions.

To deploy functions when pushing to main branch, you'll need to set up the service account and workload identity federation as denoted in the [terraform configuration](https://github.com/dylmye/lets-plan-infra).

After you've set that up, set up these action secrets on your repo:

-   `WORKLOAD_IDENTITY_PROVIDER`: The workload identity provider's "default audience", minus the iam.googleapis.com bit:

![](https://user-images.githubusercontent.com/7024578/213885829-f4d8dd4c-5ab0-4b1f-843e-2baaa9cc6f55.png)

-   `SERVICE_ACCOUNT`: The email address service account you set up, e.g. `my-service-account@my-project.iam.gserviceaccount.com`

Finally, [add the following roles](https://cloud.google.com/build/docs/deploying-builds/deploy-firebase#required_iam_permissions) to the IAM prinicpal ending in "@cloudbuild.gserviceaccount.com":

-   Firebase Admin
-   API Keys Admin
