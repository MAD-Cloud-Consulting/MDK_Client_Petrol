/**
 * Converts `value` from `fromUnits` to `toUnits`.
 * If unit dimensions are not the same (i.e. length -> time) or units do not exist,
 * `value` is returned unaltered
 * @param {ClientAPI} context MDK Context
 * @param {Number} value Value to convert from
 * @param {String} fromUnits Units to convert from
 * @param {String} toUnits Units to convert to
 * @returns {Promise<Number>} converted value in terms of `toUnits` as a Promise
 */
export function ConvertValueForUnits(context, value, fromUnits, toUnits) {
    // Get UsageUoM units, and unwrap them from the ObservableArray
    let fromUnit = context.read('/SAPAssetManager/Services/AssetManager.service', `UsageUoMs('${fromUnits}')`, [], '').then(result => {
        return result.getItem(0);
    });
    let toUnit = context.read('/SAPAssetManager/Services/AssetManager.service', `UsageUoMs('${toUnits}')`, [], '').then(result => {
        return result.getItem(0);
    });

    return Promise.all([fromUnit, toUnit]).then(unitEntities => {
         // Verify that unit types are the same. Otherwise, return `value`
        if (unitEntities[0].Dimension === unitEntities[1].Dimension) {
            return value * ((unitEntities[0].Numerator / unitEntities[0].Denominator) * (unitEntities[1].Denominator / unitEntities[1].Numerator));
        } else {
            return value;
        }
    }).catch(() => {
        return value;
    });
}
