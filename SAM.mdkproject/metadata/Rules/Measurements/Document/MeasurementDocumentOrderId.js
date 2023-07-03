import libCommon from '../../Common/Library/CommonLibrary';
export default function MeasurementDocumentOrderId(context) {
	try {
		if (context.binding.hasOwnProperty('Point')) {
			if (libCommon.isDefined(context.getClientData().MeasuringPointData[context.binding.Point].OrderId)) {
				return context.getClientData().MeasuringPointData[context.binding.Point].OrderId;
			} else {
				return context.binding.pageBinding.OrderMobileStatus_Nav.ObjectKey;
			}
		} else {
			if (libCommon.isDefined(context.getClientData().MeasuringPointData[context.binding.MeasuringPoint.Point].OrderId)) {
				return context.getClientData().MeasuringPointData[context.binding.MeasuringPoint.Point].OrderId;
			} else {
				return context.binding.pageBinding.OrderMobileStatus_Nav.ObjectKey;
			}
		}
	} catch (exc) {
        if (context.binding.WOOperation_Nav && context.binding.WOOperation_Nav.WOHeader && context.binding.WOOperation_Nav.WOHeader.ObjectKey) { //PRT from operations
            return context.binding.WOOperation_Nav.WOHeader.ObjectKey;
        }
        return '';
	}
}
