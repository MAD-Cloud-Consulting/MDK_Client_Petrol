
import locSvcMgr from '../LocationTracking/Services/ServiceManager';
import libCommon from '../Common/Library/CommonLibrary';
import ApplicationSettings from '../Common/Library/ApplicationSettings';

export default function GetCurrentGeometry(context, objectType) {
    let pageProxy = context.getPageProxy();
    let locTitle = libCommon.getControlProxy(pageProxy, 'LocationEditTitle');

    if (!locSvcMgr.getInstance().isTrackingEnabled()) {
        locSvcMgr.getInstance().enableTracking().then(function(isEnabled) {
            if (isEnabled) {
                locSvcMgr.getInstance().getCurrentLocation().then((geoJson) => {
                    if (geoJson) {
                        const title = context.localizeText('point') + ': ' +
                            geoJson.geometry.coordinates[0][0] + ',' + geoJson.geometry.coordinates[0][1];
                        const geometryValue = '{\"x\":' + geoJson.geometry.coordinates[0][1] +
                                              ',\"y\":' + geoJson.geometry.coordinates[0][0] +
                                              ',\"spatialReference\":{\"wkid\":4326}}';
                        locTitle.setValue(title);
                        locTitle.getPageProxy().currentPage.editModeInfo = {
                            geometryType: 'POINT',
                            geometryValue: geometryValue,
                        };
                        libCommon.setStateVariable(context, 'GeometryObjectType', objectType);
                        ApplicationSettings.setString(context, 'Geometry',
                            JSON.stringify(locTitle.getPageProxy().currentPage.editModeInfo));
                    }
                    // atomic operation
                    locSvcMgr.getInstance().disableTracking();
                });
            }
        });
    } else {
        locSvcMgr.getInstance().getCurrentLocation().then((geoJson) => {
            if (geoJson) {
                const title = context.localizeText('point') + ': ' +
                    geoJson.geometry.coordinates[0][0] + ',' + geoJson.geometry.coordinates[0][1];
                const geometryValue = '{\"x\":' + geoJson.geometry.coordinates[0][1] +
                                      ',\"y\":' + geoJson.geometry.coordinates[0][0] +
                                      ',\"spatialReference\":{\"wkid\":4326}}';
                locTitle.setValue(title);
                locTitle.getPageProxy().currentPage.editModeInfo = {
                    geometryType: 'POINT',
                    geometryValue: geometryValue,
                };
                libCommon.setStateVariable(context, 'GeometryObjectType', objectType);
                ApplicationSettings.setString(context, 'Geometry',
                    JSON.stringify(locTitle.getPageProxy().currentPage.editModeInfo));
            }
        });
    }
}
