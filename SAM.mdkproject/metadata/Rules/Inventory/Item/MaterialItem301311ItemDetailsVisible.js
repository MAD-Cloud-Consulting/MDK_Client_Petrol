export default function MaterialItem301311ItemDetailsVisible(context) {
    let move = context.binding.MovementType || context.binding.MoveType;
    return context.getPageProxy().binding['@odata.type'].includes('MaterialDocItem') && (move === '301' || move === '311');
}
