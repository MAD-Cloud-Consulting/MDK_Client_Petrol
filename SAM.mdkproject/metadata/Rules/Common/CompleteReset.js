import libCom from './Library/CommonLibrary';
import personalLib from '../Persona/PersonaLibrary';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import locationLib from '../LocationTracking/LocationTrackingLibrary';
import ApplicationSettings from './Library/ApplicationSettings';
import errorLib from './Library/ErrorLibrary';

export default function CompleteReset(clientAPI) {
    if (personalLib.isMaintenanceTechnician(clientAPI)) {
        let pageProxy = clientAPI.evaluateTargetPathForAPI('#Page:OverviewPage');
        let sectionedTable = pageProxy.getControls()[0];
        if (libCom.isDefined(sectionedTable)) {
            let mapSection = sectionedTable.getSections()[0];
            if (libCom.isDefined(mapSection)) {
                let mapViewExtension = mapSection.getExtensions()[0];
                if (libCom.isDefined(mapViewExtension)) {
                    mapViewExtension.clearUserDefaults();
                }
            }
        }
    }
    // Changing the flag back to false to execute Update action again on subsequent reset
    userFeaturesLib.diableAllFeatureFlags(clientAPI);
    ApplicationSettings.setBoolean(clientAPI, 'didSetUserGeneralInfos', false);
    ApplicationSettings.setBoolean(clientAPI, 'initialSync', true);

    // Disable service and rsset user switch for location tracking feature
    locationLib.disableService(clientAPI);
    locationLib.setUserSwitch(clientAPI, '');

    // Clear error messages
    errorLib.clearError(clientAPI);
}
