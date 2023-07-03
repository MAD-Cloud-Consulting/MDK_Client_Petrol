import libCommon from '../../../Common/Library/CommonLibrary';

export default function CharacteristicLamValuesCreateNav(clientAPI) {
    //Set the global TransactionType variable to CREATE
    libCommon.setOnCreateUpdateFlag(clientAPI, 'CREATE');

    //set the CHANGSET flag to true
    return clientAPI.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/CharacteristicLAMValuesCreateUpdateNav.action');
}
