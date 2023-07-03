
import style from '../../../../Common/Style/StyleFormCellButton';
import libCommon from '../../../../Common/Library/CommonLibrary';

export default function PRTEquipmentCreateUpdateOnLoaded(pageClientAPI) {
    style(pageClientAPI, 'DiscardButton');
    let formCellContainer = pageClientAPI.getControl('FormCellContainer');
    let serialNumber = formCellContainer.getControl('SerialNumber');
    if (!libCommon.IsOnCreate(pageClientAPI)) {
        let serialPartNumber = '-';
        let entitySet = pageClientAPI.binding.PRTEquipment['@odata.editLink'] + '/SerialNumber';
        return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], '').then(function(result) {
            if (result.getItem(0)) {
                serialPartNumber = result.getItem(0).SerialNumber;
            }
            return (serialNumber.setValue(serialPartNumber)).then(()=>{
                libCommon.saveInitialValues(pageClientAPI);
                return Promise.resolve(true);
            });
        }).catch(() => {
            return (serialNumber.setValue(serialPartNumber)).then(()=>{
                libCommon.saveInitialValues(pageClientAPI);
                return Promise.resolve(true);
            });
        });
    }
    libCommon.saveInitialValues(pageClientAPI);
}
