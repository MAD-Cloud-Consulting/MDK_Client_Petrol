import libCom from '../../Common/Library/CommonLibrary';

export default function RefreshAllTabsOverviewPage(clientAPI, fromDiscard = false) {
    if (!fromDiscard) {
        clientAPI.getControls()[0].redraw();
    } else {
        clientAPI.evaluateTargetPathForAPI('#Page:InventoryOverview').getControls()[0].redraw();
    }
    let emptySearch = libCom.getStateVariable(clientAPI, 'EmptySearchOnOverview');
    let pages = ['#Page:InboundOutboundListPage', '#Page:MaterialDocumentRecentList'];
    pages.forEach(pageName => {
        let pageProxy;
        // checking if page was initialized
        // if we would do without try-catch - it would be broken and
        // the rest of tha pages wouldn't be refreshed
        try {
            pageProxy = clientAPI.evaluateTargetPathForAPI(pageName);
        } catch (err) {
            // no need to display this error - just page didn't initialized
            // eslint-disable-next-line no-console
            console.log(err);
        }
        if (pageProxy) {
            let table = pageProxy.getControl('SectionedTable');
            if (table) {
                if (emptySearch) {
                    table.searchString = '';
                }
                table.redraw(true);
            }
        }
    });
    if (emptySearch) {
        libCom.removeStateVariable(clientAPI, 'EmptySearchOnOverview');
    }
}
