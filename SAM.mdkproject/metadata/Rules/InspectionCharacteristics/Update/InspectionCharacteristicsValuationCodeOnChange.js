export default function InspectionCharacteristicsValuationCodeOnChange(context) {
    let name = context.getName();
    let suffix = name.substring(name.indexOf('_'), name.length);
    let valuationControl = 'Valuation' + suffix;
    let valCtrl = context.getPageProxy().getControl('FormCellContainer')._control.getCellProxyWithName(valuationControl);
    switch (context.binding.Valuation) {
        case 'A':
            valCtrl.setStyle('AcceptedGreen','Value');
            break;
        case 'R':
        case 'F':
            valCtrl.setStyle('RejectedRed','Value');
            break;
        default:
            valCtrl.setStyle('GrayText','Value');
    }
    context.getPageProxy().getControl('FormCellContainer').redraw();
    context.clearValidation();
}

