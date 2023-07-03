
import lamField from './LAMFieldForKey';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function LAMOffset1FromFDC(context) {
    
    let offset1 = lamField(context, 'Offset1');

    if (!libVal.evalIsEmpty(offset1)) {
        return context.formatNumber(libLocal.toNumber(context, offset1), '', {useGrouping: false});
    } else {
        return '';
    }
}
