export default function ODataUpdateMode(context) {
	let mode = 'Replace';

	if (context.binding && context.binding['@sap.isLocal'] && context.binding['@sap.hasPendingChanges'])	{
		mode = 'Merge';
	}

	return mode;
}
