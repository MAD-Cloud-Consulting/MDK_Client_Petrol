import libCom from '../../../Common/Library/CommonLibrary';

/**
* Page OnLoaded event handler
* @param {IClientAPI} context
*/
export default function CharacteristicLAMValuesCreateUpdatePageOnLoaded(context) {
    libCom.saveInitialValues(context);
}
