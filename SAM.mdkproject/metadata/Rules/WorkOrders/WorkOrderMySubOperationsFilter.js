import libCom from '../Common/Library/CommonLibrary';

export default function WorkOrderMySubOperationsFilter(context) {
    return { name: 'SubOpMobileStatus_Nav/CreateUserGUID', values: [{ReturnValue: libCom.getUserGuid(context), DisplayValue: context.localizeText('my_suboperations')}]};
}
