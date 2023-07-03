
import lamFormat from './LAMFormatLAMField';

export default function LAMOffset1ValueFormat(context) {
    let value = context.binding.Offset1Value;
    let uom = context.binding.Offset1UOM;

    return lamFormat(context, value, uom);
}
