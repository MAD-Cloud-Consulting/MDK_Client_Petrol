import libCom from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function UpdateCaption(context) {
    let page = context.getPageProxy();
    let transferType = libCom.getControlProxy(page,'TransferSeg').getValue()[0].ReturnValue;
    let isTransferFrom = transferType === context.localizeText('from_vehicle');
    let plantLstPlr = libCom.getControlProxy(page,'PlantLstPkr');
    let slocLstPlr = libCom.getControlProxy(page,'StorageLocationLstPkr');
    let plantCaption = isTransferFrom ? 'to_plant' : 'from_plant';
    let slocCaption = isTransferFrom ? 'to_sloc' : 'from_sloc';
    plantLstPlr.setCaption(context.localizeText(plantCaption));
    slocLstPlr.setCaption(context.localizeText(slocCaption));
}
