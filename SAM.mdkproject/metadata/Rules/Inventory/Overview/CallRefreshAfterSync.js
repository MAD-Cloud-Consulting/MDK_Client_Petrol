import personalLib from '../../Persona/PersonaLibrary';
import refreshAllTabsOverviewPage from './RefreshAllTabsOverviewPage';
/**
* Refresh of all tabs on IM persona Overview page
* @param {IClientAPI} context
*/
export default function CallRefreshAfterSync(context) {
    if (personalLib.isInventoryClerk(context)) {
        let page = context.currentPage;
        if (page) {
            if (page.id === 'InventoryOverview') {
                refreshAllTabsOverviewPage(context);
            } else {
                let parent = page.parent;
                if (parent && parent.id && parent.id.length) {
                    if (parent.id.split('_')[0] === 'InventoryOverview') {
                        refreshAllTabsOverviewPage(context);
                    }
                } 
            }
        }
    }
    return Promise.resolve(true);
}
