import libCom from '../../Common/Library/CommonLibrary';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function EquipmentUninstallPageOnLoaded(context) {
    hideCancel(context);
    libCom.saveInitialValues(context);
}
