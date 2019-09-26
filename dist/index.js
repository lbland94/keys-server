#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JsonWatcher = require('self-reload-json');
const node_getopt_1 = __importDefault(require("node-getopt"));
const RuntimeOptions_1 = require("./RuntimeOptions");
const forEach_1 = __importDefault(require("lodash/forEach"));
// Parse runtime options
const cmdOpts = node_getopt_1.default.create([
    ['f', 'file=ARG', 'File containing the keys to serve up', 'i18n/en-us.json'],
    ['p', 'port=ARG', 'The port on which to run', '4502'],
    ['s', 'shorten', 'Whether or not to shorten the paths'],
])
    .bindHelp()
    .parseSystem();
const runtimeOpts = new RuntimeOptions_1.RuntimeOptions(cmdOpts.options);
const keys = new JsonWatcher(runtimeOpts.file);
const app = express_1.default();
app.get('*', function (req, res) {
    res.send(buildKeys());
});
function buildKeys() {
    const builtKeys = {
        image: {},
        text: keys.keys || {},
        path: keys.paths || {},
    };
    if (keys.images) {
        forEach_1.default(keys.images.renditions, (rendition, key) => {
            builtKeys.image[key] = `${keys.images.folders[rendition.folder]}/${rendition.fileName}`;
            if (rendition.transform !== 'original') {
                const ext = rendition.fileName.substring(rendition.fileName.lastIndexOf('.'));
                builtKeys.image[key] += `.transform/${rendition.transform}/image.:TOKEN${ext}`;
            }
        });
    }
    if (runtimeOpts.shorten) {
        forEach_1.default(Object.keys(builtKeys.path), (key) => {
            if (typeof builtKeys.path[key] === 'string') {
                builtKeys.path[key] = builtKeys.path[key].replace('/content/panerabread_com', '');
            }
        });
    }
    forEach_1.default(builtKeys.text, (value, key) => {
        if (typeof value !== 'string') {
            builtKeys.text[key] = '';
        }
    });
    return builtKeys;
}
function startServer(port) {
    return app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
    });
}
let lastPort = runtimeOpts.port;
function retryStart() {
    if (lastPort === runtimeOpts.port) {
        console.error(`port ${lastPort} already in use`);
    }
    if (lastPort - runtimeOpts.port < 100) {
        lastPort++;
        startServer(lastPort).on('error', retryStart);
    }
}
startServer(runtimeOpts.port).on('error', retryStart);
