import setCaption from './PartsListViewCaption';
import openQuantityQueryOptions from '../Extensions/BarcodeScannerQueryOptions'; 

export default function PartsListOnReturning(context) {
    setCaption(context);
    context.getControl('PartsListSectionedTable').redraw();

    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderComponents', openQuantityQueryOptions(context)).then(count => {
        if (count === 0) {
            context.setActionBarItemVisible(1, false);
        }
    });
}
