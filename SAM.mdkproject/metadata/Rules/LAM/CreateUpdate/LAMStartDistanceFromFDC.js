
import lamField from './LAMFieldForKey';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
    
export default function LAMStartDistanceFromFDC(context) {
    
    let startDistance = lamField(context, 'DistanceFromStart');

    if (!libVal.evalIsEmpty(startDistance)) {
        return context.formatNumber(libLocal.toNumber(context, startDistance), '', {useGrouping: false});
    } else {
        return '';
    }
}
