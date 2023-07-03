import { ChecklistLibrary as libChecklist } from './ChecklistLibrary';

/**
 * Rule used to display the various properties on the checklist list view row.
 * @see ChecklistLibrary
 */
export default function ChecklistListViewFormat(context) {
    return libChecklist.checklistListViewFormat(context);
}
