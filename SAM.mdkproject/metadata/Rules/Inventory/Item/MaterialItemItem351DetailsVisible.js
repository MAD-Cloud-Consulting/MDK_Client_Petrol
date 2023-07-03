export default function MaterialItemItem351DetailsVisible(context) {
    let move = context.binding.MovementType || context.binding.MoveType;
    return context.getPageProxy().binding['@odata.type'].includes('MaterialDocItem') && move === '351';
}
