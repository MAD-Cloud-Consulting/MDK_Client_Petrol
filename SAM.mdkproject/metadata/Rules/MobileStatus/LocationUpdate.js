import libLocationTracking from '../LocationTracking/LocationTrackingLibrary';

export default function LocationUpdate(context) {
    if (libLocationTracking.isEventBasedLocationTrackingEnabled(context)) {
        return libLocationTracking.getCurrentLocation().then((geoJson) => {
            if (geoJson) {
                return libLocationTracking.updateLocation(context, geoJson);
            }
            return Promise.resolve();
        });
    }
}
