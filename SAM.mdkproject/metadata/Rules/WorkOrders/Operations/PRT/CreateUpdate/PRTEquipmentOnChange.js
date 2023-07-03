
export default function PRTEquipmentOnChange(context) {
    
    let pageProxy = context.getPageProxy();
    let formCellContainer = pageProxy.getControl('FormCellContainer');

    let equipmentValue = context.getValue();
    let equipmentHasValue = equipmentValue.length !== 0 ? true : false;
    let UsageValueFieldControl = formCellContainer.getControl('UsageValueField');
    let UoMFieldControl = formCellContainer.getControl('UoMLstPkr');
    let ControlKeyLstPkr = formCellContainer.getControl('ControlKeyLstPkr');
    let serialNumber = formCellContainer.getControl('SerialNumber');
    UsageValueFieldControl.setEditable(equipmentHasValue);
    UoMFieldControl.setEditable(equipmentHasValue);
    ControlKeyLstPkr.setEditable(equipmentHasValue);
    serialNumber.setValue('');
    UsageValueFieldControl.setValue('');
    if (equipmentValue[0].ReturnValue) {
        UsageValueFieldControl.setValue(1);
        let serialPartNumber = '-';
        return context.read('/SAPAssetManager/Services/AssetManager.service', "MyEquipments('" + equipmentValue[0].ReturnValue + "')/SerialNumber", [], '').then(function(result) {
            if (result.getItem(0)) {
                serialPartNumber = result.getItem(0).SerialNumber;
            }
            return serialNumber.setValue(serialPartNumber);
        }).catch(() => {
            return serialNumber.setValue(serialPartNumber);
        });
    }
}
