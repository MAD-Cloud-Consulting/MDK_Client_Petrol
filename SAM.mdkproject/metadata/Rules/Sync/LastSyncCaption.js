import libVal from '../Common/Library/ValidationLibrary';

/**
 * For display of the Last Sync, pull the most recent 'download' entry from the EventLog entity
 * set and return the Time field properly formatted for local time.  Because the Time field
 * is an Edm.DateTimeOffset field, we do not need to adjust for local timezone.
 * @param {ClientAPI} context 
 */
export default function LastSyncCaption(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'EventLog', [], '$filter=Type eq \'download\'&$top=1&$orderby=Time desc').then(function(data) {
                          if (!libVal.evalIsEmpty(data)) {
                              try {
                                var result = data.getItem(0);
                                return context.localizeText('last_sync', [context.formatDatetime(new Date(result.Time))]);
                              } catch (e) {
                                    return '-';
                                }     
                            } else {
                                return '-';
                            }
                    });
}
