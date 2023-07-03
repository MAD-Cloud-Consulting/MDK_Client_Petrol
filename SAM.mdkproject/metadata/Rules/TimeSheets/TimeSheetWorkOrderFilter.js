import { GlobalVar as globals } from '../Common/Library/GlobalCommon';

export default function TimeSheetWorkOrderFilter() {
	let queryOpts = ['$orderby=OrderId asc'];

	try {
		// If autorelease is off, or we can't do local MobileStatuses, filter out local work orders
		if (globals.getAppParam().WORKORDER.AutoRelease !== 'Y' || globals.getAppParam().MOBILESTATUS.EnableOnLocalBusinessObjects !== 'Y') {
			queryOpts.push("$filter=(not startswith(OrderId, 'LOCAL_W'))");
		}
	} catch (exc) {
		// App parameter can't be fetched. Assume no autorelease and no local MobileStatus
		queryOpts.push("$filter=(not startswith(OrderId, 'LOCAL_W'))");
	}
	return queryOpts.join('&');
}
