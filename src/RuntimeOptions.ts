/**
 * Convenience class to provide strict typing and reliable defaults for our command line arguments. To add an argument,
 * add a public variable to this class with the same name as the long name passed in to `node-getopt`.
 */
export class RuntimeOptions {
  public file = 'i18n/en-us.json';
  public port = 4502;
  public shorten = false;

  /**
   * @param options - Variable passed in from output of `node-getopt` parsing.
   */
  constructor(options: {[index: string]: string | string[] | boolean}) {
    for (const key in options) {
      if (this[key] !== undefined && options[key] !== undefined) {
        if (typeof this[key] === 'number' && typeof options[key] === 'string' && options[key] !== ''
            && !isNaN(+options[key])) {
          this[key] = +options[key];
        } else if (typeof this[key] === 'string' && typeof options[key] === 'string') {
          this[key] = options[key];
        } else if (typeof this[key] === 'boolean' && typeof options[key] === 'boolean') {
          this[key] = options[key];
        }
      }
    }
  }
}
