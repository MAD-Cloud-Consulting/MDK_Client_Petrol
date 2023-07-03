
export default function MetersRecevingPlantOnValueChange(context) {
    let formCellContainer = context.getPageProxy().getControl('FormCellContainer');

    let recevingPlantControlValue = formCellContainer.getControl('ReceivingPlantLstPkr').getValue()[0].ReturnValue;
    let storagedLocationControl = formCellContainer.getControl('StorageLocationLstPkr');

    let storageControlSpecifier = storagedLocationControl.getTargetSpecifier();
    if (recevingPlantControlValue && recevingPlantControlValue !== '') {
        storageControlSpecifier.setQueryOptions(`$filter=Plant eq '${recevingPlantControlValue}'&orderby=Location`);
        storagedLocationControl.setVisible(true);
    } else {
        storagedLocationControl.setVisible(false);
        storageControlSpecifier.setQueryOptions('');
    }

    storagedLocationControl.setTargetSpecifier(storageControlSpecifier);
}
