
export default function HideActionItems(context, count = 1) {
    for (var i = 0; i < count; i++) {
        context.setActionBarItemVisible(i, false);
    }
}
