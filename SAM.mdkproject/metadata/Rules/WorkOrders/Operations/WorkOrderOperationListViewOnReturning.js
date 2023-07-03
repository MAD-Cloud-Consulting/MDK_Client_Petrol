import WorkOrderOperationListViewSetCaption from './WorkOrderOperationListViewSetCaption';
import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
* Handle OnReturning event
* @param {IClientAPI} context
*/
export default function WorkOrderOperationListViewOnReturning(context) {
    //isOperationsList means that list was opened from Overview/SideMenu
    //Set value FromOperationsList as true when returning to list from list item details
    if (context.binding && context.binding.isOperationsList && !CommonLibrary.getStateVariable(context, 'FromOperationsList')) {
        CommonLibrary.setStateVariable(context,'FromOperationsList', true);
    }

    WorkOrderOperationListViewSetCaption(context);
}
