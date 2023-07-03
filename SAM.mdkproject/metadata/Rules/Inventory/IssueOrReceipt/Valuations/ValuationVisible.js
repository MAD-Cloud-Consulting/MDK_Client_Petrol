import ValuationsQuery from './ValuationsQuery';
import libCom from '../../../Common/Library/CommonLibrary';
import getValuationType from './GetValuationType';
import enableInventoryClerk from '../../../SideDrawer/EnableInventoryClerk';

export default async function ValuationVisible(context) {
    let objectType = libCom.getStateVariable(context, 'IMObjectType');
    let binding = context.binding;
    if (objectType === 'IB' || objectType === 'OB') {
        return false;
    }
    if (binding && enableInventoryClerk(context)) {
        let isLocal = libCom.isCurrentReadLinkLocal(binding['@odata.readLink']);
        if (!isLocal) {
            let valuation = await getValuationType(context);
            if (valuation !== '') {
                return false;
            }
        }
    }
    return ValuationsQuery(context)
        .then(data => {
            if (data && data.length) {
                return !!data.getItem(0).MaterialValuation_Nav.length;
            }
            return false;
        }).catch(() => {
            return false;
        });
}
