
export default class {

    /**
     * Format latitude/logitude as human readable output from a location json string
     * @param {String} locationString - Location JSON object as String
     * @returns {@nullable String} -  localized text if location is a polygon, line or point 
     */
    static formatLocationStringObject(context, locationString) {
        let obj = JSON.parse(locationString);
        if ((obj.x && obj.y) || obj.paths || obj.rings) {
            return context.localizeText('view_on_map');
        }
        return null;
    }

}
