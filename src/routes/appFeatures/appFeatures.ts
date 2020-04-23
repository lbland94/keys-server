import axios, { AxiosResponse } from 'axios';
import { Response, Request } from 'express';
import appFeaturesDriver from '../../database/driver';
import express from 'express';

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
  }).catch((e) => console.log('error fetching keys'));
};

appFeaturesRouter.get('/', appFeatures);

appFeaturesRouter.delete('/:name', (req: Request, res: Response) => {
  appFeaturesDriver.deleteFeature(req.params.name).then(() => {
    res.status(201).send();
  }).catch((err) => {
    res.status(400).json({'status': 'failed', 'message': err.message});
  });
});

appFeaturesRouter.get('/:name', (req: Request, res: Response) => {
  appFeaturesDriver.getFeatures().then((features) => {
    const feature = features.filter(val => val.name === req.params.name).pop();
    res.json({[req.params.name]: feature && feature.value});
  }).catch(err => {
    res.status(400).json({'status': 'failed', 'message': err.message});
  });
});

appFeaturesRouter.post('/:name', (req: Request, res: Response) => {
  console.log(req.body);
  if (req.body && req.body.value) {
    appFeaturesDriver.setFeature(req.params.name, req.body.value).then(() => {
      res.status(201).send();
    }).catch(err => {
      res.status(400).json({'status': 'failed', 'message': err.message});
    });
  } else {
    res.status(400).send();
  }
});
