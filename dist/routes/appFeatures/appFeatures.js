"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const driver_1 = __importDefault(require("../../database/driver"));
const express_1 = __importDefault(require("express"));
const appFeaturesRouter = express_1.default.Router();
exports.default = appFeaturesRouter;
exports.appFeatures = (req, res) => {
    const url = 'https://www-qa-beta.panerabread.com/content/www-api/en-us/panerabread_com/_jcr_content/root.json';
    axios_1.default.get(url).then((response) => {
        driver_1.default.getFeatures().then(features => {
            if (response.data) {
                features.forEach(val => {
                    response.data[val.name] = val.value;
                });
            }
            res.json(response.data);
        });
    }).catch((e) => console.log('error fetching keys'));
};
appFeaturesRouter.get('/', exports.appFeatures);
appFeaturesRouter.delete('/:name', (req, res) => {
    driver_1.default.deleteFeature(req.params.name).then(() => {
        res.status(201).send();
    }).catch((err) => {
        res.status(400).json({ 'status': 'failed', 'message': err.message });
    });
});
appFeaturesRouter.get('/:name', (req, res) => {
    driver_1.default.getFeatures().then((features) => {
        const feature = features.filter(val => val.name === req.params.name).pop();
        res.json({ [req.params.name]: feature && feature.value });
    }).catch(err => {
        res.status(400).json({ 'status': 'failed', 'message': err.message });
    });
});
appFeaturesRouter.post('/:name', (req, res) => {
    console.log(req.body);
    if (req.body && req.body.value) {
        driver_1.default.setFeature(req.params.name, req.body.value).then(() => {
            res.status(201).send();
        }).catch(err => {
            res.status(400).json({ 'status': 'failed', 'message': err.message });
        });
    }
    else {
        res.status(400).send();
    }
});
