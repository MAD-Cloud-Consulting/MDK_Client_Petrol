import libCommon from '../../../Common/Library/CommonLibrary';
import {CreateUpdateFunctionalLocationEventLibrary as libFLOC} from '../../FunctionalLocationLibrary';

export default function TemplateValueChanged(context) {
    let pageProxy = context.getPageProxy();

    let objectSelected = false;
    let categoryPicker = libCommon.getControlProxy(pageProxy, 'CategoryLstPkr');
    let noteControl = libCommon.getControlProxy(pageProxy, 'LongTextNote');
    let categorySpecifier = categoryPicker.getTargetSpecifier();
    
    let value = libCommon.getControlValue(context);
    if (value) {
        objectSelected = true;

        context.read('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${value}')`, [], '').then(response => { 
            if (response && response.length > 0) {
                let referencedFLOC = response.getItem(0);

                libFLOC.setValues(pageProxy, referencedFLOC);
                
                let queryOptions = '';
                if (referencedFLOC.FuncLocType) {
                    queryOptions = `$filter=FuncLocCategory eq '${referencedFLOC.FuncLocType}'`;
                }

                categorySpecifier.setQueryOptions(queryOptions);
                categoryPicker.setTargetSpecifier(categorySpecifier);
            }
        });
    } else {
        categorySpecifier.setQueryOptions('');
        categoryPicker.setTargetSpecifier(categorySpecifier);
        libCommon.setFormcellEditable(noteControl);
        libCommon.getControlProxy(pageProxy, 'IncludeFormReferenceLstPkr').setValue([]);
    }

    libCommon.getControlProxy(pageProxy, 'IncludeFormReferenceLstPkr').setVisible(objectSelected);
}
