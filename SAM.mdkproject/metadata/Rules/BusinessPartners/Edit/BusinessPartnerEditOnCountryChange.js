import libCom from '../../Common/Library/CommonLibrary';

export default function BusinessPartnerEditOnCountryChange(context) {

    // Get the page context
    let pageProxy = context.getPageProxy();

    let selection = context.getValue()[0] ? context.getValue()[0].ReturnValue : '';

    let statePicker = libCom.getControlProxy(pageProxy, 'State');
    // Need to clear out Zip code and force user to enter a valid zip code to avoid Sync Error
    let zipCodeCtrl = libCom.getControlProxy(pageProxy, 'ZipCode');
    zipCodeCtrl.setValue('');

    let specifier = statePicker.getTargetSpecifier();    
    
    if (selection.length === 0) {
        // Clear State Picker
        specifier.setQueryOptions('');
        statePicker.setEditable(false);
    } else {
        specifier.setEntitySet('Regions');
        specifier.setQueryOptions(`$filter=Country eq '${selection}'&$orderby=Description`);
        specifier.setService('/SAPAssetManager/Services/AssetManager.service');
        statePicker.setEditable(true);
    }
    
    statePicker.setTargetSpecifier(specifier);
    statePicker.redraw();
}
