export default function StorageLocationOnValueChange(context) {

    let serialNumListPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:SerialNumLstPkr');
    let serialNumLstPkrSpecifier = serialNumListPicker.getTargetSpecifier();
    let entitySet = context.binding['@odata.readLink']+ '/Material/SerialNumbers';
    serialNumLstPkrSpecifier.setEntitySet(entitySet);
    serialNumLstPkrSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
    serialNumLstPkrSpecifier.setReturnValue('{SerialNumber}');
    serialNumLstPkrSpecifier.setObjectCell({
        'Title': '{SerialNumber}',
    });
    let queryOptions = "$expand=Material&$orderby=SerialNumber&$filter=Issued eq ''";
    if (context.getValue()[0].ReturnValue) {
        queryOptions = queryOptions + " and StorageLocation eq '" + context.getValue()[0].ReturnValue + "'";
    }
    serialNumLstPkrSpecifier.setQueryOptions(queryOptions);
    return serialNumListPicker.setTargetSpecifier(serialNumLstPkrSpecifier);
 }
