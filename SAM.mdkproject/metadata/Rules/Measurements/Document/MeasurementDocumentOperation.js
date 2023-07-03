import libCom from '../../Common/Library/CommonLibrary';
export default function MeasurementDocumentOperation(context) {
	try {
		if (context.binding.hasOwnProperty('Point')) {
			return libCom.isDefined(context.getClientData().MeasuringPointData[context.binding.Point].Operation) ? context.getClientData().MeasuringPointData[context.binding.Point].Operation : '';
		} else {
			return libCom.isDefined(context.getClientData().MeasuringPointData[context.binding.MeasuringPoint.Point].Operation) ? context.getClientData().MeasuringPointData[context.binding.MeasuringPoint.Point].Operation : '';
		}
	} catch (exc) {
        if (context.binding.WOOperation_Nav && context.binding.WOOperation_Nav.ObjectKey) { //PRT from operations
            return context.binding.WOOperation_Nav.ObjectKey;
        }
        return '';
	}
}
