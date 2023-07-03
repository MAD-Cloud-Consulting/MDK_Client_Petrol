
import lamFormat from './LAMFormatLAMField';

export default function LAMEndPointFormat(context) {
    let value = context.binding.EndPoint;
    let uom = context.binding.UOM;

    return lamFormat(context, value, uom);
}
