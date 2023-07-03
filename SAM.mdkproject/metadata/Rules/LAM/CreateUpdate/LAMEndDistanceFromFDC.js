
import lamField from './LAMFieldForKey';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function LAMEndDistanceFromFDC(context) {
    
    let endDistance = lamField(context, 'DistanceFromEnd');

    if (!libVal.evalIsEmpty(endDistance)) {
        return context.formatNumber(libLocal.toNumber(context, endDistance), '', {useGrouping: false});
    } else {
        return '';
    }
}
