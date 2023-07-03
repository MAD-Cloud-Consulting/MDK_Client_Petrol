import { v4 as uuidv4 } from 'uuid';
/**
 * @return<String> a GUID value
 */
export default function generateGUID() {
    return uuidv4().toUpperCase().substring(0, 32);
}
