export default function InspectionCharacteristicsInspectionCodesQueryOptions(context) {
    return '$filter=(SelectedSet eq \'' + context.binding.SelectedSet + '\' and Plant eq \'' + context.binding.SelectedSetPlant + '\' and Catalog eq \'' + context.binding.Catalog + '\')';
}
