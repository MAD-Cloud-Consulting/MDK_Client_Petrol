
import lamField from './LAMFieldForKey';
import libLocal from '../../Common/Library/LocalizationLibrary';

export default function LAMStartPointFromFDC(context) {
    
    let startPoint = lamField(context, 'StartPoint');

    return context.formatNumber(libLocal.toNumber(context, startPoint), '', {useGrouping: false});
}
