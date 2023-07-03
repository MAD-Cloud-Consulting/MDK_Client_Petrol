import libCommon from '../../Library/CommonLibrary';

export default function CategoryValueChanged(context, filteringProperty) {
    let pageProxy = context.getPageProxy();

    let templatePicker = libCommon.getControlProxy(pageProxy, 'TemplateLstPkr');
    let templateSpecifier = templatePicker.getTargetSpecifier();
    let queryOptions = '';

    let value = libCommon.getControlValue(context);
    if (value) {
        queryOptions = `$filter=${filteringProperty} eq '${value}'`;
    }

    templateSpecifier.setQueryOptions(queryOptions);
    templatePicker.setTargetSpecifier(templateSpecifier);
}
