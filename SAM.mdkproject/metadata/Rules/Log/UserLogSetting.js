import libCom from '../Common/Library/CommonLibrary';

export default function UserLogSetting(context) {
    try {
        var logger = context.getLogger();
        var enableLogSwitchControl;
        var logLevelLstPkrControl;
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
        }
        //Persist the user logging preferences
        if (logger) {
            if (logger.isTurnedOn()) {
                if (enableLogSwitchControl) {
                    enableLogSwitchControl.setValue(true);
                }
                if (logLevelLstPkrControl) {
                    logLevelLstPkrControl.setEditable(true);
                    logLevelLstPkrControl.setVisible(true);
                }
            } else {
                if (enableLogSwitchControl) {
                    enableLogSwitchControl.setValue(false);
                }
                if (logLevelLstPkrControl) {
                    logLevelLstPkrControl.setEditable(false);
                    logLevelLstPkrControl.setVisible(false);
                }
                if (logCategoriesLstPkr) {
                    logCategoriesLstPkr.setEditable(false);
                    logCategoriesLstPkr.setVisible(false);
                }
            }
            var logLevel = logger.getLevel();
            if (logLevel) {
                if (logLevelLstPkrControl) {
                    logLevelLstPkrControl.setValue([logLevel]);
                }
                logCategoriesLstPkr.setEditable(logLevel === 'Trace');
                logCategoriesLstPkr.setVisible(logLevel === 'Trace');
            }
            // //Upon selecting a value in the List picker and clicking the back button 
            // //will enable the onload page rule. This will set the selected value
            // //in the control
            if (logLevelLstPkrControl.getValue()[0]) {
                var returnValue = logLevelLstPkrControl.getValue()[0].ReturnValue;
                if (returnValue) {
                    logLevelLstPkrControl.setValue([returnValue]);
                    logger.setLevel(returnValue);
                    logCategoriesLstPkr.setEditable(returnValue === 'Trace');
                    logCategoriesLstPkr.setVisible(returnValue === 'Trace');
                }
            }
        }
    } catch (exception) {
        // eslint-disable-next-line no-console
        console.log(String(exception), 'Error User Logger could not be set');
    }
}
