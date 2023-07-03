export default function WorkOrderFavoritesFilter(context) {
    return { name: 'MarkedJob/PreferenceValue', values: [{ReturnValue: 'true', DisplayValue: context.localizeText('Favorite')}]};
}
