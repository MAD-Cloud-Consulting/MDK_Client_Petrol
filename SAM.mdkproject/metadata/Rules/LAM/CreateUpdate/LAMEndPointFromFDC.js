
import lamField from './LAMFieldForKey';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function LAMEndPointFromFDC(context) {
    
    let endPoint = lamField(context, 'EndPoint');

    if (!libVal.evalIsEmpty(endPoint)) {
        return context.formatNumber(libLocal.toNumber(context, endPoint), '', {useGrouping: false});
    } else {
        return '';
    }
}
