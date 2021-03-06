"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Convenience class to provide strict typing and reliable defaults for our command line arguments. To add an argument,
 * add a public variable to this class with the same name as the long name passed in to `node-getopt`.
 */
class RuntimeOptions {
    /**
     * @param options - Variable passed in from output of `node-getopt` parsing.
     */
    constructor(options) {
        this.file = 'i18n/en-us.json';
        this.port = 4502;
        this.shorten = false;
        this.feature = '';
        this.value = null;
        for (const key in options) {
            if (this[key] !== undefined && options[key] !== undefined) {
                if (typeof this[key] === 'number' && typeof options[key] === 'string' && options[key] !== ''
                    && !isNaN(+options[key])) {
                    this[key] = +options[key];
                }
                else if (typeof this[key] === 'string' && typeof options[key] === 'string') {
                    this[key] = options[key];
                }
                else if (typeof this[key] === 'boolean' && typeof options[key] === 'boolean') {
                    this[key] = options[key];
                }
                else if (this[key] === null && typeof options[key] === 'string') {
                    this[key] = options[key].toString().toLowerCase() === 'true';
                }
            }
        }
    }
}
exports.RuntimeOptions = RuntimeOptions;
