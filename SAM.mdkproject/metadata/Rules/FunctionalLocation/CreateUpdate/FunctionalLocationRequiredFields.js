import libCommon from '../../Common/Library/CommonLibrary';

export default function FunctionalLocationRequiredFields(context) {
    let requiredFields = ['DescriptionNote',
        'IdProperty',
        'StrcutureIndLstPkr'];

    const createFrom = libCommon.getControlValue(libCommon.getControlProxy(context, 'CreateFromLstPkr'));
    const reference = libCommon.getControlValue(libCommon.getControlProxy(context, 'ReferenceLstPkr'));
    const template = libCommon.getControlValue(libCommon.getControlProxy(context, 'TemplateLstPkr'));
    const templateVisible = libCommon.getControlProxy(context, 'TemplateLstPkr').getVisible();
    if (createFrom === 'PREVIOUSLY_CREATED' && !reference) {
        requiredFields.push('ReferenceLstPkr');
    } else if (createFrom === 'TEMPLATE' && !template && templateVisible) {
        requiredFields.push('TemplateLstPkr');
    } else {
        requiredFields.push('CategoryLstPkr');
    }

    return requiredFields;
}
