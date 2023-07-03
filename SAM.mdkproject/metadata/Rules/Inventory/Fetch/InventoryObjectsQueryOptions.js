import libVal from '../../Common/Library/ValidationLibrary';
import ODataDate from '../../Common/Date/ODataDate';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InventoryObjectsQueryOptions(context) {
    // let searchString = context.searchString;
    let documentID, documentType, dateRangeSwitch, startDate, endDate, plant, sloc;
    if (context.currentPage && (context.currentPage.id === 'FetchDocumentsPage' || context.currentPage.id === 'FetchOnlineDocumentsPage')) {
        documentID = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:DocumentId').getValue();
        documentType = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:DocumentTypeListPicker').getValue();
        dateRangeSwitch = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:DateRangeSwitch').getValue();
        startDate = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:StartDate').getValue();
        endDate = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:EndDate').getValue();
        plant = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:PlantLstPkr').getValue();
        sloc = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:SLoctLstPkr').getValue();
    } else {
        documentID = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().DocumentID;
        documentType = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().DocumentType;
        dateRangeSwitch = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().DateRangeSwitch;
        startDate = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().StartDate;
        endDate = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().EndDate;
        plant = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().Plant;
        sloc = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().Sloc;
    }
    let deliveryDateFlag = false;
    let reservationFlag = false;
    let workOrderFlag = false;
    let addOrderIdToSearch = false;
    let planFlag = false;
    let enableRequirement = false;

    let odataStartDate = new ODataDate(startDate);
    let odataEndDate = new ODataDate(endDate);
    
    let qb;
    if (context.dataQueryBuilder) {
        qb = context.dataQueryBuilder();
    } else {
        qb = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getControls()[0].dataQueryBuilder();
    }
    let filtersArray = [];

    // no ability to search with use of substing in online service, but leaving this code for perspective
    // if (searchString) {
    //     searchString = searchString.toLowerCase();
    //     filtersArray.push(`substringof('${searchString}', tolower(ObjectId))`);
    // }

    if (!libVal.evalIsEmpty(documentID) && documentID.length > 0) {
        filtersArray.push(`ObjectId eq '${documentID.substring(0, 10)}'`);
    }

    if (plant.length > 0) {
        filtersArray.push(`Plant eq '${plant[0].ReturnValue}'`);
        if (sloc.length > 0) {
            filtersArray.push(`StorageLocation eq '${sloc[0].ReturnValue}'`);
        }
    }
    
    //If nothing is selected, then, by default, we need to search for everything. You can't send an empty query to the backend.
    if (documentType.length === 0) {
        filtersArray.push('IMObject eq \'ALL\'');
        addOrderIdToSearch = true;
    } else {
        let documentTypeFilters = [];
        if (documentType.length > 0) {
            for (let i = 0; i < documentType.length; i++) {
                switch (documentType[i].ReturnValue) {
                    case 'PO':
                        documentTypeFilters.push('IMObject eq \'PO\'');
                        deliveryDateFlag = true;
                        break;
                    case 'IB':
                        documentTypeFilters.push('IMObject eq \'IB\'');
                        deliveryDateFlag = true;
                        break;
                    case 'ST':
                        documentTypeFilters.push('IMObject eq \'ST\'');
                        deliveryDateFlag = true;
                        break;
                    case 'OB':
                        documentTypeFilters.push('IMObject eq \'OB\'');
                        deliveryDateFlag = true;
                        break;
                    case 'MDOC':
                        documentTypeFilters.push('IMObject eq \'MDOC\'');
                        planFlag = true;
                        break;
                    case 'RS':
                        documentTypeFilters.push('IMObject eq \'RS\'');
                        reservationFlag = true;
                        enableRequirement = true;
                        addOrderIdToSearch = true;
                        break;
                    case 'PI':
                        documentTypeFilters.push('IMObject eq \'PI\'');
                        planFlag = true;
                        break;
                    case 'PRD':
                        documentTypeFilters.push('IMObject eq \'PRD\'');
                        planFlag = true;
                        addOrderIdToSearch = true;
                        break;
                    case 'WO':
                        workOrderFlag = true;
                        enableRequirement = true;
                        addOrderIdToSearch = true;
                        break;
                    default:
                        break;
                }
            }
        }

        /**
         * For online document search by work order, backend requires that we add "IMObject eq 'RS' and OrderId eq '<document id>'" to the query 
         * to make backend search work correctly. If "WO" document type is selected, but "RS" (reservation) type is not, 
         * then we have to add "IMObject eq 'RS'" to the search query.
         */
        if (!reservationFlag && workOrderFlag) {
            documentTypeFilters.push('IMObject eq \'RS\'');
        }
        qb.filter('(' + documentTypeFilters.join(' or ') + ')');
    }

    if (addOrderIdToSearch && !libVal.evalIsEmpty(documentID)) {
        filtersArray.push(`OrderId eq '${documentID}'`);
    }

    if (dateRangeSwitch) {
        if (deliveryDateFlag) {
            filtersArray.push(`DelvDateFrom ge datetime'${odataStartDate.toDBDateString(context)}'`);
            filtersArray.push(`DelvDateTo le datetime'${odataEndDate.toDBDateString(context)}'`);
        }
        if (enableRequirement) {
            filtersArray.push(`RequirementDateFrom ge datetime'${odataStartDate.toDBDateString(context)}'`);
            filtersArray.push(`RequirementDateTo le datetime'${odataEndDate.toDBDateString(context)}'`);              
        }
        if (planFlag) {
            filtersArray.push(`CrtDateFrom ge datetime'${odataStartDate.toDBDateString(context)}'`);
            filtersArray.push(`CrtDateTo le datetime'${odataEndDate.toDBDateString(context)}'`);
        }
    }
    
    qb.filter('(' + filtersArray.join(' and ') + ')');
    qb.orderBy('ObjectId','OrderId','IMObject');

    return qb;
}
