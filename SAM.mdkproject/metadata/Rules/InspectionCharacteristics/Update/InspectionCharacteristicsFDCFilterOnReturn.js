import libVal from '../../Common/Library/ValidationLibrary';
import inspectionCharacterics from './InspectionCharacteristics';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function InspectionCharacteristicsFDCFilterOnReturn(context) {

    var Filters= [];
    
    addEquipFilter();
    addFuncLocFilter();
    addOperationsFilter();
    addSegmentFilters();

    function addEquipFilter() {
        let equipId = context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().Equipment;
        let equipmentProperty = 'InspectionPoint_Nav/EquipNum';
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) && context.binding.EAMChecklist_Nav && context.binding.EAMChecklist_Nav.length > 0) {
            equipmentProperty = 'EAMChecklist_Nav/Equipment';
        }
        if (!libVal.evalIsEmpty(equipId)) {
            Filters.push(
                {
                    'FilterType': 'Property',
                    'FilterProperty': equipmentProperty,
                    'FilterValue': equipId,
                }
            );
        }
    }

    function addFuncLocFilter() {
        let flocId = context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().FuncLoc;
        let flocProperty = 'InspectionPoint_Nav/FuncLocIntern';
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) && context.binding.EAMChecklist_Nav && context.binding.EAMChecklist_Nav.length > 0) {
            flocProperty = 'EAMChecklist_Nav/FunctionalLocation';
        }
        if (!libVal.evalIsEmpty(flocId)) {
            Filters.push(
                {
                    'FilterType': 'Property',
                    'FilterProperty': flocProperty,
                    'FilterValue': flocId,
                }
            );
        }
    }

    function addOperationsFilter() {
        let operationsSelected = context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().OperationsSelected;
        let operationProperty = 'InspectionPoint_Nav/OperationNo';
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) && context.binding.EAMChecklist_Nav && context.binding.EAMChecklist_Nav.length > 0) {
            operationProperty = 'EAMChecklist_Nav/OperationNo';
        }
        if (!libVal.evalIsEmpty(operationsSelected)) {
            for (let operation in operationsSelected ) {
                Filters.push(
                    {
                        'FilterType': 'Property',
                        'FilterProperty': operationProperty,
                        'FilterValue': operationsSelected[operation],
                    }
                );
            }
     
        }
    }

    function addSegmentFilters() {
        let segmentValue = context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().Segment;

        if (!libVal.evalIsEmpty(segmentValue)) {
            let controls = [];
    
            let emptySegment = segmentValue.filter(segment => segment === 'Empty');
            let errorSegment = segmentValue.filter(segment => segment === 'Error');
    
            if (emptySegment.length > 0) {
                controls.push(
                    {
                        'ControlName': 'QuantitativeValue',
                        'ControlType': 'Control.Type.FormCell.SimpleProperty',
                        'ControlValueExits' : false,
                    }
                );
                controls.push(
                    {
                        'ControlName': 'QualitativeValue',
                        'ControlType': 'Control.Type.FormCell.ListPicker',
                        'ControlValueExits' : false,
                    }
                );
                controls.push(
                    {
                        'ControlName': 'QualitativeValueSegment',
                        'ControlType': 'Control.Type.FormCell.SegmentedControl',
                        'ControlValueExits' : false,
                    }
                );
            }

            if (errorSegment.length > 0 ) {

                inspectionCharacterics.validateAllCharacteristics(context); //validate all of the characteristics that has a value
                let rejectedChars = context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().RejectedChars;

                if (!libVal.evalIsEmpty(rejectedChars)) {
                    for (let index in rejectedChars) {
                        Filters.push(
                            {
                                'FilterType': 'ValidationError',
                                'FilterProperty': 'UniqueId',
                                'FilterValue': rejectedChars[index],
                            }
                        );
                    }
                } else {
                    Filters.push(
                        {
                            'FilterType': 'ValidationError',
                            'FilterProperty': 'UniqueId',
                            'FilterValue': '',
                        }
                    );
                }
                
            } else {
                Filters.push(
                    {
                        'FilterType': 'ValidationError',
                        'FilterProperty': 'UniqueId',
                        'FilterValue': '',
                    }
                );
            }
    
            Filters.push(
                {
                    'FilterType': 'Control',
                    'Controls': controls,
                }
            );
            
        }
    }
    
    context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getControl('FormCellContainer')._control.applyFilter(Filters);
    context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
}
