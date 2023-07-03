import libVal from '../../Common/Library/ValidationLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
/**
* Returns true if the CalculatedCharFlag is not set
* @param {IClientAPI} context
*/
export default function InspectionCharacteristicsOnReturning(context) {
    const extension = context.getPageProxy().getControl('FormCellContainer')._control;

    let filteredItemsCount = extension.getFilteredItemsCount();
    let totalItemsCount = extension.getTotalItemsCount();

    if (filteredItemsCount === undefined) {
        filteredItemsCount = extension._sectionCells.length;
    }

    // 'validate all' button is a part of extension controls section 
    // so it is treated by extension methods as another found item
    // and we don't want it to be considered in calculations of results counter for modal caption
    const validateButtonControl = extension.controls.find(({ _builder }) => _builder.data._Name.includes('ValidateAllButton'));
    if (validateButtonControl) {
        totalItemsCount = totalItemsCount - 1;
        if (validateButtonControl.visible) {
            filteredItemsCount = filteredItemsCount - 1;
        }
    }

    if (filteredItemsCount === totalItemsCount) {
        context.setCaption(context.localizeText('record_results_x', [totalItemsCount]));
    } else {
        context.setCaption(context.localizeText('record_results_x_x', [filteredItemsCount, totalItemsCount]));
    }

    if (extension.controls && extension.controls.length > 0) {
        let readLink;
        for (let i=0; i < extension.controls.length; i++) {
            if (extension.controls[i].binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic' && extension.controls[i].visible) {
                if (libVal.evalIsEmpty(readLink)) {
                    readLink = extension.controls[i].binding['@odata.readLink'];
                } else if (readLink !== extension.controls[i].binding['@odata.readLink']) {
                    extension.controls[extension.controls.length -1].visible = true;
                    return;
                }
            }
        }
    }
    libCommon.refreshPage(context);
}
