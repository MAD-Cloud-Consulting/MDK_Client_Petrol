import {ConvertValueForUnits} from '../../Common/UnitConverter';
import {CompareReadLink} from '../../Common/Library/ReadLinkUtils';

/**
* Handles priority selection, Consequence, Likelihood, and Due Date display
* Updates Notification Priority picker accordingly
* @param {IClientAPI} context
*/
export default function PriorityAssessment(context) {
    // Helper function to get priority type. Improves readability below
    let getPriorityType = function() {
        // eslint-disable-next-line brace-style
        let notifType = (function() {try { return context.getPageProxy().evaluateTargetPath('#Page:NotificationAddPage/#Control:TypeLstPkr/#SelectedValue'); } catch (exc) { return ''; }})();
        return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${notifType}')`, [], '').then(type => {
            return type.getItem(0).PriorityType;
        }, () => {
            // sensible default: notification type == priority type
            return notifType;
        });
    };

    // Convenience declaration
    let fdcControl = context.getPageProxy().getControls()[0]._control;

    // Priority Promises
    let priorityPromises = [];

    // Get all of the section contexts in the FDC
    let sectionContexts = fdcControl.sectionsContexts;
    // Skip first when iterating
    for (let i = 1; i < sectionContexts.length; i ++) {
        // Get first picker (Consequence)
        let consequencePicker = fdcControl.getCellsForSection(i)[1];

        // Get second picker (Likelihood)
        let likelihoodPicker = fdcControl.getCellsForSection(i)[2];

        // Get current section binding
        let currentBinding = sectionContexts[i].binding;

        let empData = context.getPageProxy().evaluateTargetPathForAPI('#Page:NotificationAddPage').getClientData().EMP || {};
        // Check if Category has both pickers filled
        if (consequencePicker.getValue().length === 1 && likelihoodPicker.getValue().length === 1) {
            let consequence = consequencePicker.getValue()[0];
            let likelihood = likelihoodPicker.getValue()[0];
            consequence.Description = `${currentBinding.Title} (${consequence.DisplayValue})`;

            // Save selected values on previous page's Client Data for re-populating this page
            if (!empData[currentBinding['@odata.readLink']])
                empData[currentBinding['@odata.readLink']] = {};
            empData[currentBinding['@odata.readLink']].Consequence = consequence.ReturnValue;
            empData[currentBinding['@odata.readLink']].ConsequenceDisplay = consequence.DisplayValue;
            empData[currentBinding['@odata.readLink']].Likelihood = likelihood.ReturnValue;
            empData[currentBinding['@odata.readLink']].LikelihoodDisplay = likelihood.DisplayValue;
            context.getPageProxy().evaluateTargetPathForAPI('#Page:NotificationAddPage').getClientData().EMP = empData;
            // Indicate EMP has been intentionally changed
            context.getPageProxy().evaluateTargetPathForAPI('#Page:NotificationAddPage').getClientData().EMPChanged = true;

            // Save relevant lookup data for computing the priority
            consequence.PrioritizationProfileId = currentBinding.PrioritizationProfileId;
            consequence.CategoryId = currentBinding.CategoryId;
            consequence.GroupId = currentBinding.GroupId;

            priorityPromises.push(context.read('/SAPAssetManager/Services/AssetManager.service',
            `PrioritizationMaps(ConsequenceId='${consequence.ReturnValue}',` +
            `PrioritizationProfileId='${currentBinding.PrioritizationProfileId}',` +
            `LikelihoodId='${likelihood.ReturnValue}',` +
            `CategoryId='${currentBinding.CategoryId}',` +
            `GroupId='${currentBinding.GroupId}')`, [], '').then(result => {
                return result.getItem(0);
            }, () => {
                return {};
            }));
        } else {
            // If only one picker has been selected, remove from EMP object
            delete empData[currentBinding['@odata.readLink']];
        }
    }

    // Set Leading Consequence and Priority display
    Promise.all(priorityPromises).then(results => {
        // Sort results by Priority. Treat empty priorities as lowest
        results.sort((a, b) => {
            if (a.Priority && b.Priority) {
                return Number(a.Priority) - Number(b.Priority);
            } else if (!b.Priority) {
                return -1;
            } else if (!a.Priority) {
                return 1;
            } else {
                return 0;
            }
        });

        let displayPromises = [];
        // Get Leading Consequence Description
        displayPromises.push(context.read('/SAPAssetManager/Services/AssetManager.service',
        `ConsequenceSeverities(GroupId='${results[0].GroupId}',` +
        `PrioritizationProfileId='${results[0].PrioritizationProfileId}',` +
        `ConsequenceId='${results[0].ConsequenceId}',` +
        `CategoryId='${results[0].CategoryId}')`, [], '').then(result => {
            return result.getItem(0).Description;
        }, () => {
            return '';
        }));
        // Get Leading Likelihood Description
        displayPromises.push(context.read('/SAPAssetManager/Services/AssetManager.service',
        `ConsequenceLikelihoods('${results[0].LikelihoodId}')`, [], '').then(result => {
            return result.getItem(0).Description;
        }, () => {
            return '';
        }));
        // Get Leading Priority
        displayPromises.push(getPriorityType().then(priorityType => {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `Priorities(Priority='${results[0].Priority}',PriorityType='${priorityType}')`, [], '').then(result => {
                return result.getItem(0);
            }, () => {
                return {'PriorityDescription' : '', 'Priority': '', 'FinalDueDateDuration' : '0', 'FinalDueDateUoM': 'H'};
            });
        }));

        // Get the display information for the leading category
        return Promise.all(displayPromises).then(displayResults => {
            // Set Consequence
            fdcControl.getCellsForSection(0)[1].setValue(displayResults[0]);
            // Set Likelihood
            fdcControl.getCellsForSection(0)[2].setValue(displayResults[1]);
            // Set Assessment Priority Simple Property Form Cell display value
            fdcControl.getCellsForSection(0)[0].setValue(displayResults[2].PriorityDescription);

            // Save values on previous page's Client Data for re-populating this page
            let empData = context.getPageProxy().evaluateTargetPathForAPI('#Page:NotificationAddPage').getClientData().EMP;
            for (let category in  empData) {
                empData[category].LeadingConsequence = CompareReadLink(category, `ConsequenceCategories(PrioritizationProfileId='${results[0].PrioritizationProfileId}',CategoryId='${results[0].CategoryId}',GroupId='${results[0].GroupId}')`);
            }
            context.getPageProxy().evaluateTargetPathForAPI('#Page:NotificationAddPage').getClientData().EMP = empData;

            context.getPageProxy().evaluateTargetPath('#Page:NotificationAddPage/#Control:PrioritySeg').setValue(displayResults[2].Priority);
            context.getPageProxy().evaluateTargetPath('#Page:NotificationAddPage/#Control:PriorityLstPkr').setValue(displayResults[2].Priority);

            // Compute final due date and display
            if (displayResults[2].Priority) {
                ConvertValueForUnits(context, displayResults[2].FinalDueDateDuration, displayResults[2].FinalDueDateUoM, 'S').then(convertedResult => {
                    let dueDate = new Date(new Date().getTime() + convertedResult * 1000);
                    dueDate.setHours(0, 0, 0, 0);

                    // Set Final Due Date Simple Property Form Cell display value
                    fdcControl.getCellsForSection(0)[3].setValue(context.formatDate(dueDate));
                });
            } else {
                fdcControl.getCellsForSection(0)[3].setValue('');
            }
        }, () => {
            // Priority could not be found. Return nothing
            fdcControl.getCellsForSection(0)[0].setValue('');
            fdcControl.getCellsForSection(0)[1].setValue('');
            fdcControl.getCellsForSection(0)[2].setValue('');
            fdcControl.getCellsForSection(0)[3].setValue('');
        });

    });
}
