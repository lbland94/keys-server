#!/usr/bin/env node
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const JsonWatcher = require('self-reload-json');
import Getopt from 'node-getopt';
import { RuntimeOptions } from './RuntimeOptions';
import forEach from 'lodash/forEach';
import { ImageRendition, Images } from './keys.interfaces';
import appFeaturesRouter, { appFeatures } from './routes/appFeatures/appFeatures';
import appFeaturesDriver from './database/driver';

// Parse runtime options
const cmdOpts = Getopt.create([
  ['f', 'file=ARG', 'File containing the keys to serve up', 'i18n/en-us.json'],
  ['p', 'port=ARG', 'The port on which to run', '4502'],
  ['s', 'shorten', 'Whether or not to shorten the paths'],
  ['F', 'feature=ARG', 'Name of feature to add to overrides'],
  ['v', 'value=ARG', 'Value of feature to add to overrides; true or false'],
])
  .bindHelp()
  .parseSystem();
const runtimeOpts = new RuntimeOptions(cmdOpts.options);

if (runtimeOpts.feature || runtimeOpts.value !== null) {
  if (!runtimeOpts.feature || runtimeOpts.value === null) {
    console.error('Both feature and value must be provided if either are.');
    process.exit(1);
  } else {
    appFeaturesDriver.setFeature(runtimeOpts.feature, runtimeOpts.value).then(() => {
      console.log(`${runtimeOpts.feature}: ${runtimeOpts.value}`);
      process.exit(0);
    }).catch((err) => {
      console.error(err);
      process.exit(1);
    });
  }
} else {
  const keys = new JsonWatcher(runtimeOpts.file);
  
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.get('/content/www-api/en-us/panerabread_com/_jcr_content/root.json', appFeatures);
  app.use('/v1/appFeatures', appFeaturesRouter);
  
  app.get('*', function (req, res) {
    res.send(buildKeys());
  });
  
  function buildKeys(): { image: any, text: any, path: any } {
    const builtKeys = {
      image: {},
      text: keys.keys || {},
      path: keys.paths || {},
    };
  
    if (keys.images) {
      forEach(keys.images.renditions, (rendition: ImageRendition, key: string) => {
        builtKeys.image[key] = `${keys.images.folders[rendition.folder]}/${rendition.fileName}`;
        if (rendition.transform !== 'original') {
          const ext = rendition.fileName.substring(rendition.fileName.lastIndexOf('.'));
          builtKeys.image[key] += `.transform/${rendition.transform}/image.:TOKEN${ext}`;
        }
      });
    }
    if (runtimeOpts.shorten) {
      forEach(Object.keys(builtKeys.path), (key) => {
        if (typeof builtKeys.path[key] === 'string') {
          builtKeys.path[key] = builtKeys.path[key].replace('/content/panerabread_com', '');
        }
      });
    }
    forEach(builtKeys.text, (value, key) => {
      if (typeof value !== 'string') {
        builtKeys.text[key] = '';
      }
    })
  
    return builtKeys;
  }
  
  function startServer(port: number) {
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
}

