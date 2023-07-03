import libCommon from '../../Common/Library/CommonLibrary';

export default class InspectionLotConstants {
    static getListQueryOptions(context, useDataQuery = true) {
        if (useDataQuery) {
            let queryBuilder = context.dataQueryBuilder();
            queryBuilder.expand('InspectionLot_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionLot_Nav/InspectionChars_Nav,InspectionLot_Nav/InspValuation_Nav,InspectionLot_Nav/InspectionCode_Nav,MyWOHeader_Nav/OrderMobileStatus_Nav');
            queryBuilder.orderBy('InspectionLot');
            return queryBuilder;
        }
        libCommon.setStateVariable(context, 'CustomListFilter', '');
        return '$expand=InspectionLot_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionLot_Nav/InspectionChars_Nav,InspectionLot_Nav/InspValuation_Nav,InspectionLot_Nav/InspectionCode_Nav,MyWOHeader_Nav/OrderMobileStatus_Nav' +
               '&$orderby=InspectionLot';
    }

    static setOperationSpecifier(picker, entity, filter) {
        let specifier = picker.getTargetSpecifier();
        specifier.setEntitySet(entity);
        specifier.setReturnValue('{OperationNo}');
        specifier.setService('/SAPAssetManager/Services/AssetManager.service');
        specifier.setQueryOptions(filter);
        specifier.setDisplayValue('{{#Property:OperationNo}} - {{#Property:OperationShortText}}');
        return picker.setTargetSpecifier(specifier);
    }
}
