
export default function InspectionCharacteristicsFDCFilterOnValueChange(context) {
    if (context.getName() === 'Equipment') {
        if (context.getValue().length > 0) {
            context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().Equipment = context.getValue()[0].ReturnValue;
        } else {
            context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().Equipment = '';
        }
    }

    if (context.getName() === 'FuncLoc') {
        if (context.getValue().length > 0) {
            context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().FuncLoc = context.getValue()[0].ReturnValue;
        } else {
            context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().FuncLoc = '';
        }
    }

    if (context.getName() === 'FilterSeg') {
        let values = [];
        let listPicker = context.getValue();
        for (let i=0 ; i<context.getValue().length ; i++) {
            values.push(listPicker[i].ReturnValue);
        }
        context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().Segment = values;  
    }

    if (context.getName() === 'Operations') {
        if (context.getValue().length > 0) {
            let values = [];
            let listPicker = context.getValue();
            for (let i=0 ; i<context.getValue().length ; i++) {
                values.push(listPicker[i].ReturnValue);
            }
            context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().OperationsSelected = values;
        } else {
            context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().OperationsSelected = [];
        }
    }
}
