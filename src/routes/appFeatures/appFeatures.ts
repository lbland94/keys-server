import axios, { AxiosResponse } from 'axios';
import { Response, Request, NextFunction } from 'express';
import appFeaturesDriver from '../../database/driver';
import express from 'express';
import path from 'path';

const appFeaturesRouter = express.Router();

export default appFeaturesRouter;

export const appFeatures = (req: Request, res: Response) => {
  const url = 'https://www-qa-beta.panerabread.com/content/www-api/en-us/panerabread_com/_jcr_content/root.json';
  axios.get(url).then((response: AxiosResponse) => {
    appFeaturesDriver.getFeatures().then(features => {
      if (response.data) {
        features.forEach(val => {
          response.data[val.name] = val.value;
        });
      }
      res.json(response.data);
    });
  }).catch((e) => {
    console.log('error fetching keys');
    res.status(500).json({status: 'failed', message: 'error fetching keys'});
  });
};

appFeaturesRouter.get('/', appFeatures);

appFeaturesRouter.use('/ui/*', (req: Request, res: Response, next: NextFunction) => {
  const p = req.params[0] ? req.params[0] : 'index.html';
  res.sendFile(p, {root: path.join(__dirname, '../../ui')});
});

appFeaturesRouter.get('/overrides', (req: Request, res: Response) => {
  appFeaturesDriver.getFeatures().then(features => {
    const featuresObj = {};
    features.forEach(val => {
      featuresObj[val.name] = val.value;
    });
    res.json(features);
  }).catch((e) => {
    console.log('error fetching keys');
    res.status(500).json({status: 'failed', message: 'error fetching keys'});
  });
});

appFeaturesRouter.delete('/:name', (req: Request, res: Response) => {
  appFeaturesDriver.deleteFeature(req.params.name).then(() => {
    res.status(204).send();
  }).catch((err) => {
    res.status(400).json({ 'status': 'failed', 'message': err.message });
  });
});

appFeaturesRouter.get('/:name', (req: Request, res: Response) => {
  appFeaturesDriver.getFeatures().then((features) => {
    const feature = features.filter(val => val.name === req.params.name).pop();
    res.json({ [req.params.name]: feature && feature.value });
  }).catch(err => {
    res.status(400).json({ 'status': 'failed', 'message': err.message });
  });
});

appFeaturesRouter.post('/:name', (req: Request, res: Response) => {
  if (req.body && req.body.value !== undefined) {
    appFeaturesDriver.setFeature(req.params.name, req.body.value).then(() => {
      res.status(201).send();
    }).catch(err => {
      res.status(400).json({ 'status': 'failed', 'message': err.message });
    });
  } else {
    res.status(400).send();
  }
});
