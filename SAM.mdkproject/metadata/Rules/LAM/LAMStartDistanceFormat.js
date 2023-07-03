
import lamFormat from './LAMFormatLAMField';

export default function LAMStartPointFormat(context) {
    let value = context.binding.StartMarkerDistance;
    let uom = context.binding.MarkerUOM;

    return lamFormat(context, value, uom);
}
