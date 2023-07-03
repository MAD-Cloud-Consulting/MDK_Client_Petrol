export default class {
    static isEditable(context, name) {
        if (context && context._control && context._control._buttonContainer) {
            return context._control._buttonContainer.isEditable(name);
        }
        return false;
    }

    static setEditable(context, name, isEditable) {
        context._control._buttonContainer.setEditable(name, isEditable);
    }

    static getTitle(context, name) {
        return context._control._buttonContainer.getTitle(name);
    }

    static setTitle(context, name, title) {
        context._control._buttonContainer.setTitle(name, title);
    }
}
