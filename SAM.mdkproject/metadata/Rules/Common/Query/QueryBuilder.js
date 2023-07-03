
/**
 * Builder class for building a query string
 */
export default class QueryBuilder {


    /**
     * 
     * @param {*} filters 
     * @param {*} expands 
     * @param {*} selects 
     * @param {*} extras 
     */
    constructor(filters=[],expands=[],selects=[],extras=[]) {
        this.filters = filters;
        this.expands = expands;
        this.selects = selects;
        this.extras = extras;
    }


    addFilter(filter) {
        this.filters.push(filter);
    }

    addAllFilters(filters) {
        this.filters.push(...filters);
    }

    addExpandStatement(expand) {
        this.expands.push(expand);
    }

    addAllExpandStatements(expandStatements) {
        this.expands.push(...expandStatements);
    }

    addSelectStatement(select) {
        this.selects.push(select);
    }

    addAllSelectStatements(selects) {
        this.selects.push(...selects);
    }

    addExtra(extra) {
        this.extras.push(extra);
    }

    addAllExtras(extra) {
        this.extras.push(...extra);
    }


    /**
     * Retrieve the string of 
     */
    build() {

        let queryString = '';
        queryString = this.applyExpandStatements(queryString);
        queryString = this.applyFilters(queryString);
        queryString = this.applySelectStatements(queryString);
        queryString = this.applyExtras(queryString);

        return queryString;
    }

    applyExpandStatements(queryString) {

        if (this.expands.length === 0) {
            return queryString;
        }

        queryString += '$expand=';
        queryString = this.addCommaSeperatedElements(queryString, this.expands);
        return queryString;
    }

    applyFilters(queryString) {

        if (this.filters.length === 0) {
            return queryString;
        }

        if (queryString.length > 0) {
            queryString += '&';
        }

        queryString += '$filter=';

        let andClause = ' and ';
        for (let filter of this.filters) {
            queryString += filter;
            queryString += andClause;
        }

        // Trim off the last 'and' clause
        queryString = queryString.substring(0, queryString.length - andClause.length);

        return queryString;
    }

    applySelectStatements(queryString) {

        if (this.selects.length === 0) {
            return queryString;
        }

        if (queryString.length > 0) {
            queryString += '&';
        }

        queryString += '$select=';
        queryString = this.addCommaSeperatedElements(queryString, this.selects);
        
        return queryString;
    }

    applyExtras(queryString) {

        if (this.extras.length === 0) {
            return queryString;
        }

        for (let extra of this.extras) {
            if (queryString.length > 0) {
                queryString += '&';
            }
            queryString += '$';
            queryString += extra;
        }

        return queryString;
    }

    addCommaSeperatedElements(queryString, elements) {

        // Add all elements to the string, seperated by commas
        for (let element of elements) {
            queryString += element;
            queryString += ',';
        }

        // Remove the last comma
        queryString = queryString.substring(0, queryString.length-1);

        return queryString;
    }
}
