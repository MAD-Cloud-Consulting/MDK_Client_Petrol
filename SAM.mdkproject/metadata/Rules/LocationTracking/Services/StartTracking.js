
import { CoreTypes } from '@nativescript/core';
import * as geolocation from '@nativescript/geolocation';

export default function StartTracking(cbFunc, cbParam, updateDistance) {
    try {
        let watchID = geolocation.watchLocation(
            (loc) => {
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
                    if (cbFunc) {
                        if (cbParam) {
                            cbFunc(geoJson, cbParam);
                        }
                    }
                }
            }, () => {
                // errors
                return -1;
            },
            {
                desiredAccuracy: CoreTypes.Accuracy.high,
                updateDistance: updateDistance,
                iosAllowsBackgroundLocationUpdates: true,
            });
        return watchID;
    } catch (ex) {
        // errors
        return -1;
    }
}
