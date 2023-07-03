
import * as geolocation from '@nativescript/geolocation';

export default function EnableTracking() {
    return geolocation.isEnabled().then((isEnabled) => {
            if (!isEnabled) {
                return geolocation.enableLocationRequest().then(() => {
                    // User Enabled Location Service
                    return Promise.resolve(true);
                }, () => {
                    // errors
                    return Promise.resolve(false);
                }).catch(() => {
                    // Unable to Enable Location
                    return Promise.resolve(false);
                });
            } else {
                // location request already enabled
                return Promise.resolve(true);
            }
        }, () => {
        // errors
        return Promise.resolve(false);
    });
}
