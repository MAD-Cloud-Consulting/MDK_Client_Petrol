import GenerateLocalID from '../Common/GenerateLocalID';

export default function GenerateTimeEntryID(context) {
    let id = GenerateLocalID(context, 'CatsTimesheets', 'Counter', '000000000000', '', '');
    return id;
}
