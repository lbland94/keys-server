# keys-server
A simple express script to serve up our UI i18n keys for local development.

## Usage:
node keys-server [OPTION]

## Options:
`-f`, `--file=ARG`    File containing the keys to serve up (default: i18n/en-us.json)

`-p`, `--port=ARG`    The port on which to run             (default: 4502)

`-s`, `--shorten`     Whether or not to shorten the paths

`-F`, `--feature=ARG` Name of feature to add to overrides

`-v`, `--value=ARG`   Value of feature to add to overrides; true or false

`-h`, `--help`     display this help
