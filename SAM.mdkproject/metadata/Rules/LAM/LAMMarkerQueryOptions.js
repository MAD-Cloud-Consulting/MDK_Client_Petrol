
import LRPValue from './LAMLinearReferencePatternValue';

export default function LAMMarkerQueryOptions(context) {

    return LRPValue(context).then(function(result) {
        if (result) {
            return `$filter=LRPId eq '${result}'&$orderby eq 'Marker'`;
        } else {
            return '';
        }
    });
    
}
