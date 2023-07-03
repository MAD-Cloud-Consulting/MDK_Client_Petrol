import Logger from '../../Log/Logger';

export default function MeasuringPointFDCFilterDefaultValue(pageClientAPI) {
    try {
        
        if (pageClientAPI.getName() === 'Equipment') {
            return pageClientAPI.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().Equipment;
        } else if (pageClientAPI.getName() === 'FuncLoc') {
            return pageClientAPI.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().FuncLoc;
        } else if (pageClientAPI.getName() === 'FilterSeg') {
            return pageClientAPI.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().Segment;
        } else if (pageClientAPI.getName() === 'FilterPRT') {
            return pageClientAPI.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().PRT;
        } else if (pageClientAPI.getName() === 'Operations') {
            return pageClientAPI.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().Operations;
        }
        return '';
    } catch (exception) {
        /**Implementing our Logger class*/
        Logger.error('Filter', `FilterUpdateCount error: ${exception}`);
        return '';
    }
}
