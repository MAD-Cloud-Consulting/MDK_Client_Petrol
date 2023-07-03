export default class {

    static getTitle(context, name) {
        return context._control._buttonContainer.getTitle(name);
    }

    static setTitle(context, name, title) {
        context._control._buttonContainer.setTitle(name, title);
    }
}
