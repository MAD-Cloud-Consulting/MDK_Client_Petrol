/**
* Sets the appropriate font for the Valuation Status
* @param {IClientAPI} context
*/
export default function InspectionPointValuationFont(context) {
    let binding = context.binding;

    if (binding.InspValuation_Nav && binding.InspValuation_Nav.Valuation) {
        let rejectedValuationCode = context.getGlobalDefinition('/SAPAssetManager/Globals/InspectionPoints/ValuationCodeRejected.global').getValue();
        let acceptedValuationCode = context.getGlobalDefinition('/SAPAssetManager/Globals/InspectionPoints/ValuationCodeAccepted.global').getValue();

        if (binding.InspValuation_Nav.Valuation === rejectedValuationCode) {
            return 'RejectedRed';
        } else if (binding.InspValuation_Nav.Valuation === acceptedValuationCode) {
            return 'AcceptedGreen';
        }
    }
}
