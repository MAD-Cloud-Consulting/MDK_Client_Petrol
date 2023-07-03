import libCommon from '../../../Common/Library/CommonLibrary';
import EnableAddCharLAM from '../EnableAddCharLAMValue';

export default function CharacteristicLamValuesUpdateNav(clientAPI) {
    // if enabled nav to edit action
    return EnableAddCharLAM(clientAPI).then((success) => {
        //Set the global TransactionType variable to CREATE
        if (success) {
            libCommon.setOnCreateUpdateFlag(clientAPI, 'UPDATE');

            //set the CHANGSET flag to true
            return clientAPI.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/CharacteristicLAMValuesCreateUpdateNav.action');
        } else {
            // not enabled, do nothing
            return Promise.resolve();
        }
    });
}
