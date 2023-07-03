import libCom from '../Common/Library/CommonLibrary';

export default function WorkOrderMyOperationsFilter(context) {
    return { name: 'OperationMobileStatus_Nav/CreateUserGUID', values: [{ReturnValue: libCom.getUserGuid(context), DisplayValue: context.localizeText('my_operations')}]};
}
