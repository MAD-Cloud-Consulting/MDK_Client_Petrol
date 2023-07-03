
import lamField from './LAMFieldForKey';
import libLocal from '../../Common/Library/LocalizationLibrary';

export default function LAMLengthFromFDC(context) {
    
    let lamLength = lamField(context, 'Length');

    return context.formatNumber(libLocal.toNumber(context, lamLength), '', {useGrouping: false});
}
