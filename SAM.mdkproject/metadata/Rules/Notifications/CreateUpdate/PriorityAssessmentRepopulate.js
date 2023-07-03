import {ConvertValueForUnits} from '../../Common/UnitConverter';
import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';
import {CompareReadLink} from '../../Common/Library/ReadLinkUtils';

/**
* Re-populates the Priority Assessment page based on previous page's client data
* @param {IClientAPI} context
*/
export default function PriorityAssessmentRepopulate(context) {
    // Convenience declaration
    let fdcControl = context.getPageProxy().getControls()[0]._control;

    let empData = context.getPageProxy().evaluateTargetPathForAPI('#Page:NotificationAddPage').getClientData().EMP;

    let workRequestConsequenceData = Promise.resolve([]); // By default, assume a create page (no @odata.readLink), so no WorkRequestConsequences exist

    if (context.getPageProxy().binding['@odata.readLink']) { // if @odata.readLink exists, attempt to read existing WorkRequestConsequences
        workRequestConsequenceData = context.read('/SAPAssetManager/Services/AssetManager.service', `${context.getPageProxy().binding['@odata.readLink']}/WorkRequestConsequence_Nav`, [], '');
    }
    return workRequestConsequenceData.then(result => {
        if (result.length > 0 && !empData) { // Only populate if empData is empty and results exist
            empData = {};
            result.forEach(value => {
                empData[`ConsequenceCategories(PrioritizationProfileId='${value.PrioritizationProfileId}',CategoryId='${value.CategoryId}',GroupId='${value.GroupId}')`] =
                {
                    'Consequence': String(value.ConsequenceId),
                    'Likelihood': String(value.LikelihoodId),
                };
                if (value.LeadingConsequence) {
                    if (value.ConsequenceId) {
                        // Populate Assessment Priority/Consequence/Likelihood/Final Due Date
                        let displayLookups = [];

                        // Get Consequence Description
                        displayLookups.push(context.read('/SAPAssetManager/Services/AssetManager.service',
                        `ConsequenceSeverities(GroupId='${value.GroupId}',` +
                        `PrioritizationProfileId='${value.PrioritizationProfileId}',` +
                        `ConsequenceId='${value.ConsequenceId}',` +
                        `CategoryId='${value.CategoryId}')`, [], '').then(readResult => {
                            return readResult.getItem(0).Description;
                        }, () => {
                            return '';
                        }));
                        // Get Likelihood Description
                        displayLookups.push(context.read('/SAPAssetManager/Services/AssetManager.service',
                        `ConsequenceLikelihoods('${value.LikelihoodId}')`, [], '').then(readResult => {
                            return readResult.getItem(0).Description;
                        }, () => {
                            return '';
                        }));
                        // Get Priority Data
                        displayLookups.push(context.read('/SAPAssetManager/Services/AssetManager.service',
                        `PrioritizationMaps(ConsequenceId='${value.ConsequenceId}',` +
                        `PrioritizationProfileId='${value.PrioritizationProfileId}',` +
                        `LikelihoodId='${value.LikelihoodId}',` +
                        `CategoryId='${value.CategoryId}',` +
                        `GroupId='${value.GroupId}')`, [], '').then(prioritizationMapLookup => {
                            return context.read('/SAPAssetManager/Services/AssetManager.service', `Priorities(Priority='${prioritizationMapLookup.getItem(0).Priority}',PriorityType='PM')`, [], '').then(priorityLookup => {
                                return priorityLookup.getItem(0);
                            }, () => {
                                return {'PriorityDescription' : '', 'Priority': '', 'FinalDueDateDuration' : '0', 'FinalDueDateUoM': 'H'};
                            });
                        }, () => {
                            return {'PriorityDescription' : '', 'Priority': '', 'FinalDueDateDuration' : '0', 'FinalDueDateUoM': 'H'};
                        }));

                        Promise.all(displayLookups).then(displayValues => {
                            fdcControl.getCellsForSection(0)[0].setValue(displayValues[0].PriorityDescription || '');
                            ConvertValueForUnits(context, displayValues[2].FinalDueDateDuration, displayValues[2].FinalDueDateUoM, 'S').then(convertedResult => {
                                let dueDate = new Date(new Date().getTime() + convertedResult * 1000);
                                dueDate.setHours(0, 0, 0, 0);

                                // Set Final Due Date Simple Property Form Cell display value
                                fdcControl.getCellsForSection(0)[3].setValue(context.formatDate(dueDate));
                            });
                            fdcControl.getCellsForSection(0)[0].setValue(displayValues[2].PriorityDescription || '');
                            fdcControl.getCellsForSection(0)[1].setValue(displayValues[0] || '');
                            fdcControl.getCellsForSection(0)[2].setValue(displayValues[1] || '');
                        });
                    }
                }
            });
        } else { // Otherwise, use existing EMP data. If undefined, use a blank object
            empData = empData || {};

            // Get Leading section
            for (let category in empData) {
                if (empData[category].LeadingConsequence) {
                    // Set Leading Consequence and Likelihood
                    fdcControl.getCellsForSection(0)[1].setValue(empData[category].ConsequenceDisplay || '');
                    fdcControl.getCellsForSection(0)[2].setValue(empData[category].LikelihoodDisplay || '');

                    // Set Priority and Due Date (requires extra lookup)
                    let properties = SplitReadLink(category);
                    context.read('/SAPAssetManager/Services/AssetManager.service',
                    `PrioritizationMaps(ConsequenceId='${empData[category].Consequence}',` +
                    `PrioritizationProfileId='${properties.PrioritizationProfileId}',` +
                    `LikelihoodId='${empData[category].Likelihood}',` +
                    `CategoryId='${properties.CategoryId}',` +
                    `GroupId='${properties.GroupId}')`, [], '').then(prioritizationMapLookup => {
                        return context.read('/SAPAssetManager/Services/AssetManager.service', `Priorities(Priority='${prioritizationMapLookup.getItem(0).Priority}',PriorityType='PM')`, [], '').then(priorityLookup => {
                            // Set Priority Description
                            fdcControl.getCellsForSection(0)[0].setValue(priorityLookup.getItem(0).PriorityDescription);
                            ConvertValueForUnits(context, priorityLookup.getItem(0).FinalDueDateDuration, priorityLookup.getItem(0).FinalDueDateUoM, 'S').then(convertedResult => {
                                let dueDate = new Date(new Date().getTime() + convertedResult * 1000);
                                dueDate.setHours(0, 0, 0, 0);

                                // Set Final Due Date Simple Property Form Cell display value
                                fdcControl.getCellsForSection(0)[3].setValue(context.formatDate(dueDate));
                            });
                        }, () => {
                            // Can't get Due Date
                            fdcControl.getCellsForSection(0)[3].setValue('');
                        });
                    }, () => {
                        // Can't get Priority
                        fdcControl.getCellsForSection(0)[0].setValue('');
                    });
                    break;
                }
            }
        }

        // Get all of the section contexts in the FDC
        let sectionContexts = fdcControl.sectionsContexts;
        // Skip first section when iterating
        for (let i = 1; i < sectionContexts.length; i ++) {
            // Get first picker (Consequence)
            let consequencePicker = fdcControl.getCellsForSection(i)[1];

            // Get second picker (Likelihood)
            let likelihoodPicker = fdcControl.getCellsForSection(i)[2];

            // Get current section binding
            let currentBinding = sectionContexts[i].binding;

            // Populate pickers according to saved EMP object values

            for (let key in empData) {
                if (CompareReadLink(currentBinding['@odata.readLink'], key)) {
                    consequencePicker.setValue(empData[key].Consequence, false);
                    likelihoodPicker.setValue(empData[key].Likelihood, false);
                    break;
                }
            }
        }
    });
}
