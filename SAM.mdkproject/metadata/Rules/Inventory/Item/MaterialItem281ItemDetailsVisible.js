export default function MaterialItem281ItemDetailsVisible(context) {
    let move = context.binding.MovementType || context.binding.MoveType;
    return context.getPageProxy().binding['@odata.type'].includes('MaterialDocItem') && (move === '281' || move === '282');
}
