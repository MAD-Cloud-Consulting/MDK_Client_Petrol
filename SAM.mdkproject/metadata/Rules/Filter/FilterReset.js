import Logger from '../Log/Logger';
import filterLib from './FilterLibrary';

export default function FilterReset(context) {
    try {
        filterLib.setDefaultFilter(context.getPageProxy(), true);
    } catch (exception) {
        /**Implementing our Logger class*/
        Logger.error('Filter', `FilterReset error: ${exception}`);
    }
}
