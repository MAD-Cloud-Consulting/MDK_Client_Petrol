import vehicleCount from './CrewVehicleSummaryCount';
export default function CrewVehicleListViewOnPageLoad(context) {
    let sectionedTableProxy = context.getControls()[0];
    sectionedTableProxy.redraw();
    return vehicleCount(context).then(count => {
        return context.setCaption(context.localizeText('vehicles_x', [count]));
    });
    
}
