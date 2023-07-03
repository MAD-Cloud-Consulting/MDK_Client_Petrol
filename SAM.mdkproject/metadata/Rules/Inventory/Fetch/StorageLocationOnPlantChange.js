import libCom from '../../Common/Library/CommonLibrary';

export default function StorageLocationOnPlantChange(context) {

    let pageProxy = context.getPageProxy();
    let selection = context.getValue()[0] ? context.getValue()[0].ReturnValue : '';
    let SLocPicker = libCom.getControlProxy(pageProxy, 'SLoctLstPkr');
    let specifier = SLocPicker.getTargetSpecifier();    

    specifier.setEntitySet('StorageLocations');
    specifier.setQueryOptions(`$filter=Plant eq '${selection}'`);
    specifier.setService('/SAPAssetManager/Services/AssetManager.service');

    SLocPicker.setTargetSpecifier(specifier);
    SLocPicker.redraw();
}
