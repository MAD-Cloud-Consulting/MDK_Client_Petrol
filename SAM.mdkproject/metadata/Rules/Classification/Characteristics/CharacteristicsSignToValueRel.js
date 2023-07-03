export default function CharacteristicsSignToValueRel(returnValues) {
    var relBefore;
    var relAfter;
    if (returnValues.length === 4) {
        relBefore = returnValues[0];
        relAfter = returnValues[2];
        if (relBefore === '> ' && relAfter === ' - ') {
            return '5';
        } else if (relBefore === '> ' && relAfter === ' - < ') {
            return '4';
        } else if (relBefore === '' && relAfter === ' - ') {
            return '3';
        } else if (relBefore === '' && relAfter === ' - < ') {
            return '2';
        } 
    } else {
        switch (returnValues[0]) {
            case '>= ':
                return '9';
            case '> ':
                return '8';
            case '<= ':
                return '7';
            case '< ':
                return '6';
            case '':
                return '1';
            default:
                return '';
        }
    }
}
