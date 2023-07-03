export default function OnSLocToToSelected(context) {
    if (context.getValue().length > 0) {
        let planToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('PlantToListPicker');
        let materialListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('MatrialListPicker');
        let moveStorageBin = context.getPageProxy().getControl('FormCellContainer').getControl('ToStorageBinSimple');
        if (planToListPicker.getValue().length && materialListPicker.getValue().length) {
            let materialNum = materialListPicker.getValue()[0].DisplayValue.SubstatusText;
            let plantTo = planToListPicker.getValue()[0].ReturnValue;
            let slocTo = context.getValue()[0].ReturnValue;
            if (materialNum && plantTo && slocTo) {
                return context.read(
                    '/SAPAssetManager/Services/AssetManager.service',
                    'MaterialSLocs',
                    [],
                    "$select=StorageBin&$filter=MaterialNum eq '" + materialNum + "' and Plant eq '" + plantTo + "' and StorageLocation eq '" + slocTo + "'"
                ).then((val) => {
                    if (val && val.length === 0) {
                        return context.read(
                            '/SAPAssetManager/Services/OnlineAssetManager.service',
                            'MaterialSLocs',
                            [],
                            "$select=StorageBin&$filter=MaterialNum eq '" + materialNum + "' and Plant eq '" + plantTo + "' and StorageLocation eq '" + slocTo + "'"
                        ).then((value) => {
                            return setToSBin(value, moveStorageBin);
                        }).catch(() => {
                            return setToSBin([], moveStorageBin);
                        });
                    } else {
                        return setToSBin(val, moveStorageBin);
                    }
                });
            } else {
                moveStorageBin.setValue('');
                moveStorageBin.setEditable(false);
                moveStorageBin.redraw();
                return true;
            }
        }
    }
}

export function setToSBin(val, moveStorageBin) {
    if (val && val.length === 1) {
        let row = val.getItem(0);
        moveStorageBin.setValue(row.StorageBin);
        moveStorageBin.setEditable(row.StorageBin === '');
    } else {
        moveStorageBin.setValue('');
        moveStorageBin.setEditable(true);
    }
    moveStorageBin.redraw();
    return true;
}
