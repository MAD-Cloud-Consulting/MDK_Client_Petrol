import objListCount from './ObjectListsCount';
/**
 * Creates the caption label for ObjectListView.page. It adds the count to the caption.
 * @param {*} pageProxy Its parent, PageProxy, should contain the MyWorkOrderHeaders or MyWorkOrderOperations binding object.
 */
export default function ObjectListViewCaption(sectionedTableProxy) {
    return objListCount(sectionedTableProxy.getPageProxy()).then(count => {
        return sectionedTableProxy.localizeText('object_lists_count', [count]);
    });
}
