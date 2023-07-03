import libVal from '../../Common/Library/ValidationLibrary';
import common from '../../Common/Library/CommonLibrary';
import downloadActionsOrRulesSequence from './DownloadActionsOrRulesSequence';

export default function DownloadDefiningRequest(context, index) {
   
    let sequences = downloadActionsOrRulesSequence(context);
    if (sequences.length > 0) {
        if (libVal.evalIsEmpty(index)) {
            index = 0;
        }
        let object;
        if (!libVal.evalIsEmpty(sequences[index].Properties)) {
            object = {
                'Name': sequences[index].Action,
                'Properties': sequences[index].Properties,
            };
        } else {
            object = {
                'Name': sequences[index].Action,
            };
        }
        context.showActivityIndicator(sequences[index].Caption);
        if (!libVal.evalIsEmpty(sequences[index].Action)) {
            return context.executeAction(object).then(() => {
                if (index === sequences.length - 1) {
                    context.dismissActivityIndicator();
                    common.setInitialSync(context);
                    common.setApplicationLaunch(context, true);
                    return Promise.resolve();
                }
                index = index + 1;
                context.dismissActivityIndicator();
                return DownloadDefiningRequest(context, index);
            }).catch(function() {
                return false;
            });
        } else if (!libVal.evalIsEmpty(sequences[index].Rule)) {
            return context.getDefinitionValue(sequences[index].Rule).then(() => {
                if (index === sequences.length - 1) {
                    common.setInitialSync(context);
                    common.setApplicationLaunch(context, true);
                    context.dismissActivityIndicator();
                    return Promise.resolve();
                }
                index = index + 1;
                context.dismissActivityIndicator();
                return DownloadDefiningRequest(context, index);
            }).catch(function() {
                return false;
            });
        }
    }
}
