export default function CharacteristicRelationDescription(context, relationShip) {
    switch (relationShip) {
        case '>=':
            return context.localizeText('greater_equal');
        case '<=':
            return context.localizeText('lesser_equal');
        case '>':
            return context.localizeText('greater_than');
        case '<':
            return context.localizeText('lesser_than');
        default:
            break;
    }
}
