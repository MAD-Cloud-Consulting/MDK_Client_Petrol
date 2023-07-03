import NetworkLib from '../../Common/Library/NetworkMonitoringLibrary';
import FeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import CommonLib from '../../Common/Library/CommonLibrary';
import PersonaLib from '../../Persona/PersonaLibrary';
import Logger from '../../Log/Logger';
import IsSyncInProgress from '../../Sync/IsSyncInProgress';
import SyncDataInBackground from '../SyncData';
import self from './AutoSyncLibrary';

export default class AutoSyncLibrary {

    static autoSync(context) {
        const autoSyncConst = context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSync.global').getValue();
        if (self.didThresholdPeriodPass(context)) {
            if (!NetworkLib.isNetworkConnected(context)) {
                Logger.error(autoSyncConst, 'no network connection');
                // setTimeout is required to display an error message after all other actions (navigation, success message) have completed.
                setTimeout(() => {
                    context.executeAction('/SAPAssetManager/Actions/OData/InitializeOfflineODataCreateFailureMessage.action');
                }, 5000);
                return false;
            }
            
            if (!IsSyncInProgress(context)) {
                self.setAutoSyncInProgress(context, true);

                let syncAction = self.showSyncBanner(context) ? 
                    context.executeAction('/SAPAssetManager/Actions/SyncInitializeProgressBannerMessage.action') :
                    SyncDataInBackground(context);

                return syncAction
                    .then(() => {
                        Logger.info(autoSyncConst, 'auto sync successed');
                        return true;
                    }).catch(() => {
                        Logger.error(autoSyncConst, 'failed to auto sync');
                        return false;
                    }).finally(() => {
                        CommonLib.setStateVariable(context, 'lastAutoSyncDateTime', (new Date()).toISOString());
                        self.setAutoSyncInProgress(context, false);
                    });
            }
        }

        return true;
    }

    static showSyncBanner(context) {
        const isBannerVisible = self.getAutoSyncParamValue(context, '/SAPAssetManager/Globals/AutoSync/AutoSyncBannerConfig.global');
        return isBannerVisible === 'Y';
    }

    static isAutoSyncEnabledOnResume(context) {
        return self.isAutoSyncFeatureEnabled(context) && 
            self.isAutoSyncParamEnabled(context, '/SAPAssetManager/Globals/AutoSync/AutoSyncResume.global');
    }

    static isAutoSyncEnabledOnSave(context) {
        const thresholdPeriod = self.getAutoSyncParamValue(context, '/SAPAssetManager/Globals/AutoSync/AutoSyncThresholdPeriod.global');
        if (!thresholdPeriod || thresholdPeriod <= 0) {
            return false;
        }
        return self.isAutoSyncFeatureEnabled(context) && 
            self.isAutoSyncParamEnabled(context, '/SAPAssetManager/Globals/AutoSync/AutoSyncOnSave.global');
    }
    
    static isAutoSyncEnabledOnConnectionChange(context) {
        return self.isAutoSyncFeatureEnabled(context) && 
            self.isAutoSyncParamEnabled(context, '/SAPAssetManager/Globals/AutoSync/AutoSyncOnConnectionChange.global');
    }

    static isPeriodicAutoSyncEnabled(context) {
        return self.isAutoSyncFeatureEnabled(context) && 
            self.isAutoSyncParamEnabled(context, '/SAPAssetManager/Globals/AutoSync/AutoSyncPeriodic.global');
    }
    
    static isAutoSyncEnabledOnStatusChange(context) {
        return self.isAutoSyncFeatureEnabled(context) && 
            self.isAutoSyncParamEnabled(context, '/SAPAssetManager/Globals/AutoSync/AutoSyncOnStatusChange.global');
    }

    static getAutoSyncPeriodValue(context) {
        return self.getAutoSyncParamValue(context, '/SAPAssetManager/Globals/AutoSync/AutoSyncPeriodic.global');
    }

    static getAutoSyncParamValue(context, paramNameFilePath) {
        return CommonLib.getAppParam(context,
            context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSync.global').getValue(),
            context.getGlobalDefinition(paramNameFilePath).getValue());
    }
    
    static isAutoSyncParamEnabled(context, paramNameFilePath) {
        const paramValue = self.getAutoSyncParamValue(context, paramNameFilePath);
        return paramValue === 'Y' || paramValue > 0;
    }

    static isAutoSyncFeatureEnabled(context) {
        const feature = context.getGlobalDefinition('/SAPAssetManager/Globals/Features/AutoSync.global');
        return FeaturesLib.isFeatureEnabled(context, feature.getValue());
    }

    static autoSyncOnAppResume(context) {
        if (self.isAutoSyncEnabledOnResume(context)) {
            return self.autoSync(context);
        }

        return true;
    }

    static autoSyncOnSave(context) {
        if (self.isAutoSyncEnabledOnSave(context)) {
            return self.autoSync(context);
        }

        return true;
    }

    static autoSyncPeriodically(context) {
        // clear previous interval if exists
        const existingInterval = CommonLib.getStateVariable(context, 'autoSyncIntervalID');
        if (CommonLib.isDefined(existingInterval)) {
            clearInterval(existingInterval);
            CommonLib.removeStateVariable(context, 'autoSyncIntervalID');
        }
        if (self.isPeriodicAutoSyncEnabled(context)) {
            const interval = self.getAutoSyncPeriodValue(context) * 60 * 1000; // value comes in minutes, so convert to ms
            const intervalID = setInterval(self.autoSync, interval, context);
            CommonLib.setStateVariable(context, 'autoSyncIntervalID', intervalID);
        }

        return true;
    }

    static autoSyncOnConnectionChange(context) {
        NetworkLib.getInstance().removeCallbackAction('initializeSync');
        if (self.isAutoSyncEnabledOnConnectionChange(context)) {
            NetworkLib.getInstance().addCallbackAction('initializeSync', function() {
                if (!CommonLib.isInitialSync(context)) {
                    return self.autoSync(context);
                }
                
                return true;
            });
        }

        return true;
    }

    static autoSyncOnStatusChange(context) {
        if (self.isAutoSyncEnabledOnStatusChange(context)) {
            return self.autoSync(context);
        }

        return true;
    }
    
    static didThresholdPeriodPass(context) {
        const thresholdPeriod = self.getAutoSyncParamValue(context, '/SAPAssetManager/Globals/AutoSync/AutoSyncThresholdPeriod.global');
        const lastAutoSync = CommonLib.getStateVariable(context, 'lastAutoSyncDateTime');
        if (!CommonLib.isDefined(lastAutoSync)) {
            return true;
        }

        const currentDateTime = new Date();
        const lastAutoSyncDateTime = new Date(lastAutoSync);
      
        return Math.ceil((currentDateTime - lastAutoSyncDateTime) / 60000) > thresholdPeriod;
    }
    
    static setAutoSyncInProgress(context, flag) {
        CommonLib.setStateVariable(context, 'IsAutoSync', flag);
        const currentPageName = CommonLib.getPageName(context);
        const overviewPageName = PersonaLib.getPersonaOverviewStateVariablePage(context); 
        let overviewPage = context.evaluateTargetPathForAPI('#Page:' + overviewPageName); 
        
        // change action bar item manually as we don't want to redraw overview page
        overviewPage.setActionBarItemVisible('AutoSync', flag);
        overviewPage.setActionBarItemVisible('Sync', !flag);
        if (currentPageName !== overviewPageName) { 
            context.redraw();
        }
    }
}
