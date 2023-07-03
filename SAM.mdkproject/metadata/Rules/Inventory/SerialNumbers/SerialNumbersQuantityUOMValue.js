import libCom from '../../Common/Library/CommonLibrary';

export default function QuantityUom(context) {
    const target = libCom.getStateVariable(context, 'SerialPageBinding');
    const quantity = libCom.getStateVariable(context, 'OpenQuantity');
    const uom = target.UOM;

    return quantity + ' ' + uom;
}
