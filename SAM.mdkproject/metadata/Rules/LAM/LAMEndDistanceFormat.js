
import lamFormat from './LAMFormatLAMField';

export default function LAMEndPointFormat(context) {
    let value = context.binding.EndMarkerDistance;
    let uom = context.binding.MarkerUOM;

    return lamFormat(context, value, uom);
}
