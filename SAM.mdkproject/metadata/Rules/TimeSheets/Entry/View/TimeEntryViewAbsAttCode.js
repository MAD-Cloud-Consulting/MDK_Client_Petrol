
export default function TimeEntryViewAbsAttCode(context) {
    let attendAbsenceType = '';
    if (context.constructor.name === 'SectionedTableProxy') {
        attendAbsenceType = context.binding.AttendAbsenceType;
    } else {
        attendAbsenceType = context.getPageProxy().binding.AttendAbsenceType;
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'AttendanceTypes', [], `$filter=AttendanceType eq '${attendAbsenceType}'`).then(result => {
        if (!result || result.length === 0) {
            return '-';
        }
        return result.getItem(0).AttendanceTypeText;
    });
}
