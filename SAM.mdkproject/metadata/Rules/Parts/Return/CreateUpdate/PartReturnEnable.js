import libPart from '../../PartLibrary';

export default function PartReturnEnable(pageProxy) {

    return libPart.getLocalQuantityIssued(pageProxy, pageProxy.binding).then(localQty => {
        if (pageProxy.binding.WithdrawnQuantity + localQty > 0) {
            return true;
        }
        return false;
    });
}
