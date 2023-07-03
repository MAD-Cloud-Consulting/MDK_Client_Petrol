export default function MaterialItem101DetailsVisible(context) {
    let move = context.binding.MovementType || context.binding.MoveType;
    return context.getPageProxy().binding['@odata.type'].includes('MaterialDocItem') && (move === '101' || move === '102');
}
