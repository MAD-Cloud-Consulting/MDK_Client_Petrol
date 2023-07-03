/**
 * Static class that contains Assignment Type information
 */
export default class AssignmentType {

    // Gets field default, or overridden default if present
    // Type is used to determine if overridden default should be used
    static getWorkOrderFieldDefault(type, field) {
        if (type === this._woAssnDefaults.type) {
            return this._woAssnDefaults[field].default;
        } else {
            return this._woAssnDefaults[field].defaultOverride ? this._woAssnDefaults[field].defaultOverride : this._woAssnDefaults[field].default;
        }
    }

    // Non-destructively offers a default override
    // Set value to 'undefined' to unset override
    static setWorkOrderFieldDefault(field, value) {
        if (this._woAssnDefaults[field].default !== value)
            this._woAssnDefaults[field].defaultOverride = value;
    }

    // Remove all of the default override values after being used
    static removeWorkOrderDefaultOverride() {
        if (this._woAssnDefaults) {
            if (this._woAssnDefaults.PlanningPlant.defaultOverride) {
                this._woAssnDefaults.PlanningPlant.defaultOverride = null;
            }
            if (this._woAssnDefaults.WorkCenterPlant.defaultOverride) {
                this._woAssnDefaults.WorkCenterPlant.defaultOverride = null;
            }
            if (this._woAssnDefaults.MainWorkCenter.defaultOverride) {
                this._woAssnDefaults.MainWorkCenter.defaultOverride = null;
            }
        }
    }

    // Get Assignment Type defaults JSON object
    static getWorkOrderAssignmentDefaults() {
        return this._woAssnDefaults;
    }

    // Set Assignment Type defaults JSON object
    // Creates or destructively overwrites object
    static setWorkOrderAssignmentDefaults(value) {
        this._woAssnDefaults = value;
    }
}
