import libCommon from '../../../Common/Library/CommonLibrary';
import { EquipmentCreateUpdateLibrary } from '../../EquipmentCreateUpdateLibrary';

export default function TemplateValueChanged(context) {
    let pageProxy = context.getPageProxy();

    let objectSelected = false;
    let categoryPicker = libCommon.getControlProxy(pageProxy, 'CategoryLstPkr');
    let categorySpecifier = categoryPicker.getTargetSpecifier();

    let value = libCommon.getControlValue(context);
    if (value) {
        objectSelected = true;

        context.read('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${value}')`, [], '').then(response => { 
            let referencedEquipment = response.getItem(0);

            EquipmentCreateUpdateLibrary.setValues(pageProxy, referencedEquipment);

            let queryOptions = '';
            if (referencedEquipment.EquipCategory) {
                queryOptions = `$filter=EquipCategory eq '${referencedEquipment.EquipCategory}'`;
            }

            categorySpecifier.setQueryOptions(queryOptions);
            categoryPicker.setTargetSpecifier(categorySpecifier);
        });
    } else {
        categorySpecifier.setQueryOptions('');
        categoryPicker.setTargetSpecifier(categorySpecifier);
    }

    libCommon.getControlProxy(pageProxy, 'IncludeFormReferenceLstPkr').setVisible(objectSelected);
    libCommon.clearValidationOnInput(context);
}
