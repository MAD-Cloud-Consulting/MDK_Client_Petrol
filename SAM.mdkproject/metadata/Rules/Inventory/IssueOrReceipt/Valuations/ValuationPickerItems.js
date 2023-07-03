import ValuationsQuery from './ValuationsQuery';
import Logger from '../../../Log/Logger';

export default function ValuationPickerItems(context) {
    const result = [];
    return ValuationsQuery(context)
        .then(data => {
            if (data && data.getItem) {
                const valuations = data.getItem(0).MaterialValuation_Nav;
                const length = valuations.length;

                if (length) {
                    for (let i = 0; i < length; i++) {
                        const value = valuations[i].ValuationType;
                        if (value) {
                            result.push({ReturnValue: value, DisplayValue: value});
                        }
                    }
                }
            }
            return result;
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/Inventory/CategoryValuation.global').getValue(),`ValuationPickerItems(context) error: ${error}`);
            return result;
        });
}
