import libCom from '../Common/Library/CommonLibrary';
import FSMOverviewOnPageReturning from '../OverviewPage/FSMOverviewOnPageReturning';

/**
* Changing ActualDate state variable when function is afected from datepicker
* @param {IClientAPI} context
*/
export default function ActualDateChanges(context) {
    let formCellControl = context.getPageProxy().evaluateTargetPath('#Control:FieldServiceSectionedTable').sections[2];
    if (formCellControl) {
        let dateControl = formCellControl.controls[0];
        if (dateControl) {
            let date = dateControl.context.clientAPIProps.newControlValue;
            if (date) {
                let newDate =  new Date(new Date(date).setHours(0,0,0,0));
                libCom.setStateVariable(context, 'ActualDate', newDate);
                return libCom.createOverviewRow(context, newDate).then(() => {
                    context.currentPage.redraw();

                    // Refresh the map view
                    FSMOverviewOnPageReturning(context.getPageProxy());
                    return Promise.resolve();
                });
                
            }
        }
    }
}
