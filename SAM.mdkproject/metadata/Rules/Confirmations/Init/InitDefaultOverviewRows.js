import CreateDefaultOverviewRowEntities from './CreateDefaultOverviewRowEntities';
import DeleteUnusedOverviewEntities from './DeleteUnusedOverviewEntities';
import ConfirmationsIsEnabled from '../ConfirmationsIsEnabled';

/**
 * Initialize the overview entities over the 
 * @param {*} context 
 */
export default function InitDefaultOverviewRows(context) {

    if (ConfirmationsIsEnabled(context)) {
        return DeleteUnusedOverviewEntities(context).then(result => {
            if (result) {
                return CreateDefaultOverviewRowEntities(context);
            }
            return Promise.resolve(true);
        });
    }
    return Promise.resolve(true);
}
