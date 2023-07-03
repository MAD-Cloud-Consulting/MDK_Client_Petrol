
import lamFormat from './LAMFormatLAMField';

export default function LAMOffset2ValueFormat(context) {
    let value = context.binding.Offset2Value;
    let uom = context.binding.Offset2UOM;

    return lamFormat(context, value, uom);
}
