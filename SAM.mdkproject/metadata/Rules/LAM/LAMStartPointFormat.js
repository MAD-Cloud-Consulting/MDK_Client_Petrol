import lamFormat from './LAMFormatLAMField';

export default function LAMStartPointFormat(context) {
    let value = context.binding.StartPoint;
    let uom = context.binding.UOM;

    return lamFormat(context, value, uom);
}
