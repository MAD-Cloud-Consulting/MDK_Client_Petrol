import { Application } from '@nativescript/core';

export let HeaderFormCell;
let HeaderFormCellModule;
/*
This is a sample of how to implement iOS and Android codes separately in a metadata extension.
Because all ts files in metadata Extensions folder will be bundled together using webpack,
if you execute any iOS codes in Android vice versa, it will likely cause issue such as crash.

By splitting the implementation into different files and encapsulate them in a function, it allows
us to load only the required module for the platform at runtime.
*/
if (!HeaderFormCell) {
    //Here you will check what platform the app is in at runtime.
    if (Application.ios) {
        //if app is in iOS platform, load the ButtonStack module from ios folder
        HeaderFormCellModule = require('./ios/HeaderFormCell');
    } else {
        //otherise, assume app is in Android platform, load the ButtonStack module from android folder
        HeaderFormCellModule = require('./android/HeaderFormCell');
    }
    // calling GetButtonStackClass() will return ButtonStack class for the correct platform.
    //  See the ButtonStack.ts in ios/andrid folder for details
    HeaderFormCell = HeaderFormCellModule.GetButtonStackClass();
}
