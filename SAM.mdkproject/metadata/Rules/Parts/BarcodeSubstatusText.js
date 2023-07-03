import libPart from './PartLibrary';
export default function BarcodeSubstatusText(context) {
    let requirementQuantity = context.binding.QuantityUnE;
    let withdrawnQuantity = context.binding.WithdrawnQuantity;
    return new Promise((resolve, reject) => {
        try {
            libPart.getLocalQuantityIssued(context, context.binding).then(result => {
                withdrawnQuantity = withdrawnQuantity + result;
                if (withdrawnQuantity < requirementQuantity) {
                    let text = withdrawnQuantity+' / '+requirementQuantity+ ' '+context.binding.UnitOfEntry;
                    resolve(text);
                } else {
                    resolve('');
                }
            });
        } catch (error) {
            reject('');
        }
    });
}
