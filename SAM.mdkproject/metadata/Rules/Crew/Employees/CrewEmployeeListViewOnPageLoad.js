import employeeCount from './CrewEmployeeSummaryCount';
export default function CrewEmployeeListViewOnPageLoad(context) {
    let sectionedTableProxy = context.getControls()[0];
    sectionedTableProxy.redraw();
    return employeeCount(context).then(count => {
        return context.setCaption(context.localizeText('current_crew_members_x', [count]));
    });   
}
