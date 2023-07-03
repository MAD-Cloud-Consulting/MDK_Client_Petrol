
import lamField from './LAMFieldForKey';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function LAMOffset2FromFDC(context) {
    
    let offset2 = lamField(context, 'Offset2');

    if (!libVal.evalIsEmpty(offset2)) {
        return context.formatNumber(libLocal.toNumber(context, offset2), '', {useGrouping: false});
    } else {
        return '';
    }
}
