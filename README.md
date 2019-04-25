# evently-frontent

Evently is an events discovery app that allows you to swipe left/right on a stack of event cards: right to indicate interest, and left to indicate lack of interest. View a timeline of events you liked through the app, add these events to your calendar and purchase tickets. 

This is the frontend of the app, built in React Native. We used Redux to manage global state, mapbox for location services, and connect to a Firebase backend. 

## Getting Started

- get the GoogleServiceInfo file from an admin
- `yarn setup` pulls node packages and installs ios cocoapods
- `yarn ios` starts react native app in ios simulator

## Running the tests

- `yarn test` runs all of our test 
- testing that each component renders, and renders according to a "snapshot" of what the component looked like in previous renders 
- created mocks for Firebase, Mapbox, other Native elements 
- used jest for testing 

### Coding style tests

We used DeepScan to enforce style, as well as JSPrettier, which formats code upon save. 

## Deployment

CI set up via TestFlight. 

## Built With

* [React Native](https://facebook.github.io/react-native/) - JS Framework for Native applications 
* [Redux](https://redux.js.org/) - Global state manager 
* [Mapbox](https://www.mapbox.com/) - Location services 
* [Firebase](https://firebase.google.com/) - Realtime Database
