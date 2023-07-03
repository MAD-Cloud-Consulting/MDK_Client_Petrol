/**
* Set transaction ignore to true if checklist has been synced already
* @param {IClientAPI} clientAPI
*/
export default function IgnoreIfNotLocal(context) {
	// If record has not been synced, lodata_sys_eid will have index >= 0; therefore, true. Negate this as locals should not be ignored.
	return !(context.binding['@odata.readLink'].indexOf('lodata_sys_eid') >= 0);
}
