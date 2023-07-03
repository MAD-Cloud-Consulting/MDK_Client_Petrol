import GenerateLocalID from '../../Common/GenerateLocalID';
import libCom from '../../Common/Library/CommonLibrary';

export default function PartLocalItemNumber(context) {
    let OperationLstPkrValue = libCom.getListPickerValue(libCom.getTargetPathValue(context, '#Control:OperationLstPkr/#Value'));
    let WOLstPkrValue  = libCom.getListPickerValue(libCom.getTargetPathValue(context, '#Control:Order/#Value'));
    return GenerateLocalID(context, 'MyWorkOrderComponents', 'ItemNumber', '0000', `$filter=OrderId eq '${WOLstPkrValue}' and OperationNo eq '${OperationLstPkrValue}'`, '');
}
