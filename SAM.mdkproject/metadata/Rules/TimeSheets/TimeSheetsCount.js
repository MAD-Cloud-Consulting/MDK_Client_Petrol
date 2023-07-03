import {TimeSheetLibrary as libTS} from './TimeSheetLibrary';

export default function TimeSheetsCount(sectionProxy) {   
    return sectionProxy.count('/SAPAssetManager/Services/AssetManager.service','CatsTimesheetOverviewRows',libTS.TimeSheetEntriesListQueryOptions(sectionProxy)).then(count => {
        return count;
    });
}
