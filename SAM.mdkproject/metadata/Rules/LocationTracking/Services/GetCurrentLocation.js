
import { CoreTypes } from '@nativescript/core';
import * as geolocation from '@nativescript/geolocation';

export default function GetCurrentLocation() {
    return geolocation.getCurrentLocation({
        desiredAccuracy: CoreTypes.Accuracy.high,
        maximumAge: 5000,
        timeout: 10000,
    }).then((loc) => {
            if (loc) {
                let geoJson = {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [],
                    },
                    'properties': null,
                };
                geoJson.geometry.coordinates.push([loc.latitude, loc.longitude]);
                return Promise.resolve(geoJson);
            } else {
                // location not found
                return Promise.resolve();
            }
        }, () => {
            // errors
            return Promise.resolve();
        });
}
