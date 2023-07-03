/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function SetDateRangeVisibility(context) {
    let DateRangeSwitch = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:DateRangeSwitch');
    let startDate = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:StartDate');
    let endDate = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:EndDate');

    startDate.setVisible(false);
    endDate.setVisible(false);

    if (DateRangeSwitch.getValue()) {
        startDate.setVisible(true);
        endDate.setVisible(true);
    } else {
        startDate.setVisible(false);
        endDate.setVisible(false);
    }

    startDate.redraw();
    endDate.redraw();
}
