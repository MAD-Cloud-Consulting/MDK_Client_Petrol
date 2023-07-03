import libCom from '../../Common/Library/CommonLibrary';

/**
 * Returns the transaction id used for grouping newly created PI header with line items and serial numbers
 * @param {*} context 
 * @returns 
 */
export default function PhysicalInventoryCreateTransactionID(context) {
    let doc = libCom.getStateVariable(context, 'PhysicalInventoryLocalId');
    let year = libCom.getStateVariable(context, 'PhysicalInventoryLocalFiscalYear');

    return doc + year;
}
