import libCom from '../Common/Library/CommonLibrary';

export default function ToggleUserLogging(context) {
    try {
        var logger = context.getLogger();
        var enableLogSwitchControl;
        var logLevelLstPkrControl;
        var sendActivityLogButton;
        var logCategoriesLstPkr;
        var dict = libCom.getControlDictionaryFromPage(context);
        if (dict) {
            if (dict.EnableLogSwitch) {
                enableLogSwitchControl = dict.EnableLogSwitch;
            }
            if (dict.LogLevelLstPkr) {
                logLevelLstPkrControl = dict.LogLevelLstPkr;
            }
            if (dict.LogCategoriesLstPkr) {
                logCategoriesLstPkr = dict.LogCategoriesLstPkr;
            }
            if (dict.Send) {
                sendActivityLogButton = dict.Send;
            }
        }
        let switchValue = enableLogSwitchControl.getValue();
        if (switchValue) {
            logger.on();
            logLevelLstPkrControl.setVisible(true);
            logLevelLstPkrControl.setEditable(true);
            logLevelLstPkrControl.redraw();
            sendActivityLogButton.setVisible(true);
            sendActivityLogButton.redraw(true);
            let logLevel = logLevelLstPkrControl.getValue();
            if (logLevel && logLevel[0] && logLevel[0].ReturnValue === 'Trace') {
                logCategoriesLstPkr.setVisible(true);
                logCategoriesLstPkr.setEditable(true);
            }

        } else {
            logger.off();
            logLevelLstPkrControl.setEditable(false);
            logLevelLstPkrControl.redraw();
            sendActivityLogButton.setVisible(false);
            sendActivityLogButton.redraw(false);
            logCategoriesLstPkr.setVisible(false);
            logCategoriesLstPkr.setEditable(false);
        }
        return switchValue;
    } catch (exception) {
        logger.log(String(exception), 'Error');
        return undefined;
    }
}
