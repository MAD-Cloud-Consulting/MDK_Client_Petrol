import filterLib from '../../Filter/FilterLibrary';

export default function FilterResetAllControls(context) {
    try {
        context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().Equipment = '';
        context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().FuncLoc = '';
        context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().Segment = '';
        context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().PRT = false;
        context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().Operations = '';
        filterLib.setDefaultFilter(context.getPageProxy(), true);
    } catch (exception) {
        /**Implementing our Logger class*/
        
    }
}
