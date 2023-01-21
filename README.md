<p align="center">
  <a href="https://lets-plan.ninja">
    <img src="https://raw.githubusercontent.com/dylmye/lets-plan/main/logo.png" alt="Let's Plan logo" height="96">
  </a>
</p>

## Firebase Functions

A number of Firebase Gen 1 and Gen 2 Cloud Functions.

### Functions

* `removeRelatedOnTripDelete` - Triggered by trip delete. Deletes subcollections and, if uploaded, the Firebase Storage image (stored on the trip as `trip.image`)
