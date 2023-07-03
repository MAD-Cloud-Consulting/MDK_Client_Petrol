export default function InspectionLotValuationStatusFilter(context) {
    return {
        name: 'InspectionLot_Nav/ValuationStatus',
        values: [
            { ReturnValue: 'A', DisplayValue: context.localizeText('accepted')},
            { ReturnValue: 'R', DisplayValue: context.localizeText('rejected')},
            { ReturnValue: '', DisplayValue: context.localizeText('not_valuated')}],
    };
}
