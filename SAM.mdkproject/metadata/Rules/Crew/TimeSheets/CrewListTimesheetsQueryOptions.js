import libCom from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';

export default function CrewListTimesheetsQueryOptions(context) {
    let odataDate = "datetime'" + new ODataDate(context.binding.Date).toLocalDateString() + "'";

    return `$filter=RemovalFlag ne 'X' and CrewList/SAPUserName eq '${libCom.getSapUserName(context)}' and CrewList/OriginTimeStamp eq ${odataDate} and CrewItemType eq 'EMPLOYEE'&$expand=Employee/CatsTimesheet&$orderby=Employee/LastName`;
}

