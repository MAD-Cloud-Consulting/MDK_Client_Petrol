
import * as geolocation from '@nativescript/geolocation';

export default function StopTracking(watchID) {
    geolocation.clearWatch(watchID);
}
