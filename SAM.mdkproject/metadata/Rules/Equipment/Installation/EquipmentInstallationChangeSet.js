import appSettings from '../../Common/Library/ApplicationSettings';
import libCommon from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

export default function EquipmentInstallationChangeSet(context) {

    let equipmentPreviousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    if (!libCommon.getPageName(equipmentPreviousPage) === 'EquipmentDetailsPage') {
        let isFromErrorArchive = context.evaluateTargetPath('#Page:-Previous/#ClientData/#Property:FromErrorArchive'); 
        if (isFromErrorArchive === true) { 
            context.executeAction('/SAPAssetManager/Actions/Equipment/Installation/EquipmentInstallationDeleteChangeSet.action');
        }
    } 

    let equipments = context.getControl('FormCellContainer').getControl('EquipmentPicker').getValue();
    // Update app settings string with locally installed equipments to use for discard later 
    try {
        let locallyInstalledString = appSettings.getString(context, 'LocallyIntalledEquip');
        let locallyInstalled = locallyInstalledString ? JSON.parse(locallyInstalledString) : [];
        locallyInstalled = locallyInstalled.concat(equipments.map(item => item.ReturnValue));
        if (locallyInstalled.length > 0) {
            appSettings.setString(context, 'LocallyIntalledEquip', JSON.stringify(locallyInstalled));
        }
    } catch (err) {
        Logger.error('EquipmentInstallation - ', 'failed to set appSettings string');
    }
    return libCommon.CallActionWithPickerItems(context, '/SAPAssetManager/Actions/Equipment/Installation/EquipmentInstallationChangeSet.action', equipments).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/Equipment/Installation/EquipmentInstallClosePage.action');
    });
}
