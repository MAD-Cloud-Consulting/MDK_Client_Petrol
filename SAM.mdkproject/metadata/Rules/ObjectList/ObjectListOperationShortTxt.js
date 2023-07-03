import libVal from '../Common/Library/ValidationLibrary';

/**
 * Gets the operation short-text by using the WOOperation_Nav navlink from MyWorkOrderObjectLists entityset record.
 * Returns dash if short-text isn't found.
 * @param {*} context PageProxy or SectionProxy. Its binding object should be the MyWorkOrderObjectLists entityset object.
 */
export default function ObjectListOperationShortTxt(context) {
    let workOrderObjectList = context.binding;
    let operation = workOrderObjectList.WOOperation_Nav;
    if (!libVal.evalIsEmpty(operation)) {
        let opShortTxt = operation.OperationShortText;
        if (!libVal.evalIsEmpty(opShortTxt)) {
            return opShortTxt;
        } else if (workOrderObjectList.OperationNo) {  //If operation description is blank, return the operation number
            return workOrderObjectList.OperationNo;
        }
    } else if (workOrderObjectList.OperationNo) {  //If operation not on device, return the operation number
        return workOrderObjectList.OperationNo;
    }
    return '-';
}
