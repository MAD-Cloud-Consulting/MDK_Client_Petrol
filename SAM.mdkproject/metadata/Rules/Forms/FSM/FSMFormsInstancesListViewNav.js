import libCom from '../../Common/Library/CommonLibrary';

export default function FSMFormsInstancesListViewNav(context) {
    libCom.setStateVariable(context, 'FORMS_FILTER', '');
    return context.executeAction('/SAPAssetManager/Actions/Forms/FSM/FSMFormsInstancesListViewNav.action');
}
