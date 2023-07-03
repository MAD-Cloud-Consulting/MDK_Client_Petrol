import libPart from './PartLibrary';
export default function BarcodeScannerVerifyOverIssuePart(context) {
    let requirementQuantity = context.binding.RequirementQuantity;
    let withdrawnQuantity = context.binding.WithdrawnQuantity;
    return new Promise((resolve, reject) => {
        try {
            libPart.getLocalQuantityIssued(context, context.binding).then(result => {
                withdrawnQuantity = withdrawnQuantity + result;
                if (withdrawnQuantity < requirementQuantity) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        } catch (error) {
            reject(false);
        }
    });
}
