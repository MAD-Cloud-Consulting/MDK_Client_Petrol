export default function InspectionDate(context) {
    if (context.binding.ResultChangedAt) {
        return context.formatDate(context.binding.ResultChangedAt);
    } else {
        return '-';
    }
}
