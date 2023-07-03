import libVal from '../Common/Library/ValidationLibrary';
export default function ErrorArchiveMessage(context) {
    var binding = context.binding;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', [], '$filter=RequestID eq ' + binding.RequestID).then(function(data) {
                          if (!libVal.evalIsEmpty(data)) {
                              try {
                                var message = JSON.parse(JSON.stringify(data.getItem(0).Message).replace(/\\/g,'').slice(1, -1));
                                return message.error.message.value;
                              } catch (e) {
                                if (!libVal.evalIsEmpty(data.getItem(0).Message)) {
                                    return data.getItem(0).Message;
                                } else {
                                    return '-';
                                }
                              }
                          }  
                          return '-';
                      });
}
