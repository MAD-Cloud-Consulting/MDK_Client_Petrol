import {ValueIfExists} from '../Common/Library/Formatter';

export default function DocumentFileName(context) {
    return ValueIfExists(context.binding.Document.FileName, '-', function(val) {
        return val.replace('&KEY&', '');
    });
}
