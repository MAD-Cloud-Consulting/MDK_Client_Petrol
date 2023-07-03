import CommonLibrary from '../Common/Library/CommonLibrary';
/**
 * Creates the query that we use to get the work order object list. We are filtering out assembly objects because they are currently not supported on the client. They are supported by the backend AddOn pack only right now.
 * Used by WorkOrderDetails.page and WorkOrderOperationDetails.page.
 * 
 * @param {*} sectionedTableProxy
 */
export default function ObjectListsCount(sectionedTableProxy) {
    let bindingObj = sectionedTableProxy.getPageProxy().binding;
    let objectListQuery = "$filter=((Assembly eq '') or (Assembly eq null))";
    let readLink = bindingObj['@odata.readLink'];
    return CommonLibrary.getEntitySetCount(sectionedTableProxy, readLink + '/WOObjectList_Nav', objectListQuery);
}
