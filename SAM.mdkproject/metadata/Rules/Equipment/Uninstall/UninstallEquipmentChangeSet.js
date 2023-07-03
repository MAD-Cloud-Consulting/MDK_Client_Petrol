import libCommon from '../../Common/Library/CommonLibrary';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import appSettings from '../../Common/Library/ApplicationSettings';

// Check if any of the selected equipments were installed locally and dicard installation, for the rest ones do a regular dismantle action
export default function UninstallEquipmentChangeSet(context) {

    let equipments = context.getControl('FormCellContainer').getControl('EquipmentPicker').getValue();
    let locallyInstalledEquip;
    let equipToDiscard = [];
    let equipToDismantle = [];
    try {
        locallyInstalledEquip = JSON.parse(appSettings.getString(context, 'LocallyIntalledEquip'));
    } catch (err) {
        locallyInstalledEquip = [];
    }

    if (libCommon.isDefined((locallyInstalledEquip))) {
        for (let i = 0; i < equipments.length; i++) {
            let item = equipments[i];
            if (locallyInstalledEquip.includes(item.ReturnValue)) {
                equipToDiscard.push(item);
            } else {
                equipToDismantle.push(item);
            }
        }
    } else {
        equipToDismantle = equipments;
    }

    return libCommon.CallActionWithPickerItems(context, '/SAPAssetManager/Actions/Equipment/Installation/EquipmentInstallationDiscardChangeSet.action', equipToDiscard).then(() => {
        return libCommon.CallActionWithPickerItems(context, '/SAPAssetManager/Actions/Equipment/Uninstall/UninstallEquipmentChangeSet.action', equipToDismantle).then(() => {
            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Equipment/Uninstall/UninstallSuccess.action');
        });
    });
}
