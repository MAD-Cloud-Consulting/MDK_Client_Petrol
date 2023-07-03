
import lamFormat from './LAMFormatLAMField';

export default function LAMLengthFormat(context) {
    let value = context.binding.Length;
    let uom = context.binding.UOM;

    return lamFormat(context, value, uom);
}
