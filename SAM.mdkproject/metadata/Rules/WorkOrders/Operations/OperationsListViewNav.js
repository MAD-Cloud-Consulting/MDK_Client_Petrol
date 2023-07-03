import libCom from '../../Common/Library/CommonLibrary';
import OperationsListViewWithResetFiltersNav from './OperationsListViewWithResetFiltersNav';

export default function OperationsListViewNav(context) {

    let actionBinding = {
        isOperationsList: true,
    };

    context.getPageProxy().setActionBinding(actionBinding);
    libCom.setStateVariable(context,'FromOperationsList', true);
    return OperationsListViewWithResetFiltersNav(context);
}
