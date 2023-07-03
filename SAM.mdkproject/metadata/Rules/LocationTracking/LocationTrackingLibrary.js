
import Logger from '../Log/Logger';
import libFeature from '../UserFeatures/UserFeaturesLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import libNetwork from '../Common/Library/NetworkMonitoringLibrary';
import lib from './LocationTrackingLibrary';
import manager from './Services/ServiceManager';
import CurrentDateTime from '../DateTime/CurrentDateTime';
import libPersona from '../Persona/PersonaLibrary';
import ApplicationSettings from '../Common/Library/ApplicationSettings';
import isAndroid from '../Common/IsAndroid';
import { MapLocationServiceManager } from 'extension-MapFramework';

export default class LocationTrackingLibrary {

    static periodicFunc(geoJson, context) {
        lib.updateLocation(context, geoJson);
    }

    static initService(context) {
        const persona = libPersona.getActivePersona(context);
        const userSwitch = lib.getUserSwitch(context, persona);
        // disable service if enabled due to persona swtich
        lib.disableService(context);

        if (libFeature.isFeatureEnabled(context,
            context.getGlobalDefinition('/SAPAssetManager/Globals/Features/LocationUpdate.global').getValue())) {
            // check if allow user to override the settings
            const allowOverride = lib.isAllowOverride(context);
            if (libVal.evalIsEmpty(userSwitch)) {
                lib.setUserSwitch(context, persona, 'init');
                const dialogAction = allowOverride ?
                    '/SAPAssetManager/Actions/LocationTracking/LocationTrackingConfirmOverrideDialog.action' :
                    '/SAPAssetManager/Actions/LocationTracking/LocationTrackingEnableDialog.action';
                    return lib.enableService(context).then((isEnabled) => {
                        if (isEnabled) {
                            return context.executeAction(dialogAction).then((result) => {
                                if (result.data === true) {
                                    return context.executeAction('/SAPAssetManager/Actions/LocationTracking/LocationTrackingAllowOverrideDialog.action').then(() => {
                                   
                                        // enable by default
                                        if (allowOverride) {
                                            lib.setUserSwitch(context, persona, 'on');
                                        }
                                });
                                }
                                lib.setUserSwitch(context, persona, 'off');
                                return context.executeAction('/SAPAssetManager/Actions/LocationTracking/LocationTrackingDisallowOverrideDialog.action');
                            });
                        } else {
                            lib.setUserSwitch(context, persona, 'off');
                            return context.executeAction('/SAPAssetManager/Actions/LocationTracking/LocationTrackingDisallowOverrideDialog.action');
                        }
                    });
            } else {
                if (!allowOverride || (allowOverride && userSwitch === 'on')) {
                    return lib.enableService(context).then((isEnabled) => {
                        // disable due to permission rejection
                        if (!isEnabled && allowOverride) {
                            lib.setUserSwitch(context, persona, 'off');
                        }
                    });
                }
            }
        }
        return Promise.resolve();
    }

    static enableService(context) {
        if (!manager.getInstance().isTrackingEnabled()) {
            return manager.getInstance().enableTracking().then(function(isEnabled) {
                if (isEnabled) {
                    const distance = libCommon.getAppParam(context, 'LOCATION_TRACKING', 'DistanceBasedTracking') === 'Y' ?
                          parseFloat(libCommon.getAppParam(context, 'LOCATION_TRACKING', 'DistanceThreshold')) : undefined;
                    if (distance) {
                        if (isAndroid(context)) {
                            MapLocationServiceManager.getInstance().startTracking(lib.periodicFunc, context, distance);
                        } else {
                            manager.getInstance().startTracking(lib.periodicFunc, context, distance);
                        }
                    }
                    // start monitoring nextwork connectivity
                    lib.startNetworkMonitoring(context);
                    return Promise.resolve(true);
                }
                return Promise.resolve(false);
            });
        }
        return Promise.resolve(true);
    }

    static disableService(context) {
        if (manager.getInstance().isTrackingEnabled()) {
            // stop location updates on connectivity change
            libNetwork.getInstance().removeCallbackAction('updateLocation');
            if (isAndroid(context)) {
                MapLocationServiceManager.getInstance().stopTracking();
            }
            manager.getInstance().disableTracking();
        }
    }

    static isAllowOverride(context) {
        return libCommon.getAppParam(context, 'LOCATION_TRACKING', 'AllowOverride') === 'Y';
    }

    static getUserSwitch(context, persona) {
        const userSwitch = ApplicationSettings.getString(context, 'LocationTrackingUserSwitch');
        if (libVal.evalIsEmpty(userSwitch)) {
            return '';
        }
        if (userSwitch.indexOf(persona) === -1) {
            if (libFeature.isFeatureEnabled(context,
                context.getGlobalDefinition('/SAPAssetManager/Globals/Features/LocationUpdate.global').getValue(), persona)) {
                if (libPersona.getActivePersona(context) === persona) {
                    return 'off';
                }
                lib.setUserSwitch(context, persona, 'on');
                return 'on';
            }
            return '';
        }
        return 'on';
    }

    static setUserSwitch(context, persona, flag = '') {
        if (libVal.evalIsEmpty(flag) || flag === 'init') {
            ApplicationSettings.setString(context, 'LocationTrackingUserSwitch', flag);
            return;
        }
        let userSwitch = ApplicationSettings.getString(context, 'LocationTrackingUserSwitch');
        let array = userSwitch.split(',');
        if (flag === 'on') {
            if (array.indexOf(persona) === -1) {
                array.push(persona);
            }
        } else { // off
            array = array.filter(it => it !== persona);
        }
        ApplicationSettings.setString(context, 'LocationTrackingUserSwitch', array.join(','));
    }

    static isEventBasedLocationTrackingEnabled(context) {
        return libCommon.getAppParam(context, 'LOCATION_TRACKING', 'EventBasedLocationTracking') === 'Y';
    }

    static startNetworkMonitoring(context) {
        libNetwork.getInstance().addCallbackAction('updateLocation', function() {
            return lib.getCurrentLocation().then((geoJson) => {
                lib.updateLocation(context, geoJson);
            });
        });
    }

    static isNetworkConnected(context) {
        const connectivityModule = context.nativescript.connectivityModule;
        switch (connectivityModule.getConnectionType()) {
            case connectivityModule.connectionType.wifi:
            case connectivityModule.connectionType.mobile:
                return true;
            default:
                break;
        }        
        return false;
    }

    static getCurrentLocation() {
        return manager.getInstance().getCurrentLocation();
    }

    static updateLocation(context, geoJson) {
        if (geoJson && libCommon.isApplicationLaunch(context)) {
            Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryLocationTracking.global').getValue(),
                'updateLocation: ' + CurrentDateTime(context));

            let geoValue = geoJson.geometry.coordinates[0][0] + ':' + geoJson.geometry.coordinates[0][1];

            if (lib.isNetworkConnected(context)) {
                if (!libCommon.isOnlineServiceInitialized(context)) {
                    return context.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action').then(() => {
                        return lib.createLocationEntitySet(context, '/SAPAssetManager/Services/OnlineAssetManager.service', geoValue);
                    });
                }
                return lib.createLocationEntitySet(context, '/SAPAssetManager/Services/OnlineAssetManager.service', geoValue);
            }
            return lib.createLocationEntitySet(context, '/SAPAssetManager/Services/AssetManager.service', geoValue);
        }

        return Promise.resolve();
    }

    static createLocationEntitySet(context, service, geoValue) {
        let userGUID = libCommon.getUserGuid(context);
        let headers = {
            'OfflineOData.NonMergeable': true,
        };
        if (libFeature.isFeatureEnabled(context,
            context.getGlobalDefinition('/SAPAssetManager/Globals/Features/FSMIntegration.global').getValue())) {
            headers['transaction.omdo_id'] = context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GeolocationFSM.global').getValue();
        }
        return context.executeAction({'Name': '/SAPAssetManager/Actions/LocationTracking/LocationCreate.action', 'Properties': {
            'Properties': {
                'UserGUID': userGUID,
                'CurrentTimeStamp': '/SAPAssetManager/Rules/DateTime/CurrentDateTime.js',
                'GeometryValue': geoValue,
            },
            'Target': {
                'EntitySet': 'UserLocations',
                'Service': service,
                'ReadLink': '',
            },
            'Headers': headers,
        }});
    }
}
