import libVal from '../../Common/Library/ValidationLibrary';

export default function NotificationDetailsReportedBy(context) {
    var binding = context.binding;
    if (libVal.evalIsEmpty(binding.ReportedBy)) {
        return '-';
    }

    return binding.ReportedBy;
}
