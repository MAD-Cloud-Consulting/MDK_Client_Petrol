import CreateDefaultOverviewRowEntities from './CreateDefaultOverviewRowEntities';
import DeleteUnusedOverviewEntities from './DeleteUnusedOverviewEntities';
import TimeSheetsIsEnabled from '../TimeSheetsIsEnabled';

/**
 * Initialize the overview entities over the 
 * @param {*} context 
 */
export default function InitDemoOverviewRows(context) {

    if (TimeSheetsIsEnabled(context) && context.isDemoMode()) {
        return DeleteUnusedOverviewEntities(context).then(() => {
            return CreateDefaultOverviewRowEntities(context);
        });
    }
    return Promise.resolve(true);
}
