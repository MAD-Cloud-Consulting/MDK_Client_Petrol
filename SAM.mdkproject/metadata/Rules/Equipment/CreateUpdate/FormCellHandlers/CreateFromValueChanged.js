import libCommon from '../../../Common/Library/CommonLibrary';

export default function CreateFromValueChanged(context) {
    let pageProxy = context.getPageProxy();

    let templateKeySelected = false;
    let previousKeySelected = false;

    let categoryPicker = libCommon.getControlProxy(pageProxy, 'CategoryLstPkr');
    let categorySpecifier = categoryPicker.getTargetSpecifier();

    let queryOptions = '';

    let createFromKey = libCommon.getControlValue(libCommon.getControlProxy(pageProxy, 'CreateFromLstPkr'));
    switch (createFromKey) {
        case 'TEMPLATE': {
            templateKeySelected = true;
            queryOptions = '$filter=sap.entityexists(EquipTemplate_Nav)';
            break;
        }
        case 'PREVIOUSLY_CREATED': {
            previousKeySelected = true;
            break;
        }
        default: {
            break;
        }
    }

    categorySpecifier.setQueryOptions(queryOptions);
    categoryPicker.setTargetSpecifier(categorySpecifier);

    libCommon.getControlProxy(pageProxy, 'CategoryLstPkr').setValue('');
    libCommon.getControlProxy(pageProxy, 'CategoryLstPkr').setVisible(true);
    libCommon.getControlProxy(pageProxy, 'TemplateLstPkr').setValue('');
    libCommon.getControlProxy(pageProxy, 'TemplateLstPkr').setVisible(templateKeySelected);
    libCommon.getControlProxy(pageProxy, 'ReferenceLstPkr').setValue('');
    libCommon.getControlProxy(pageProxy, 'ReferenceLstPkr').setVisible(previousKeySelected);
    libCommon.getControlProxy(pageProxy, 'IncludeFormReferenceLstPkr').setVisible(false);

    libCommon.clearValidationOnInput(context);
}
