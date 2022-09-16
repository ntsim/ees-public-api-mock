import bodyParser from 'body-parser';
import express, { ErrorRequestHandler } from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import path from 'path';
import {
  permanentExclusionsPublication,
  publications,
  pupilAbsencePublication,
} from '../mocks/publications';
import {
  absenceRatesDataSetData,
  absenceRatesByCharacteristicsDataSetData,
  permanentExclusionsDataSetData,
} from '../mocks/dataSetData';
import {
  absenceRatesDataSetMeta,
  absenceRatesByCharacteristicsDataSetMeta,
  permanentExclusionsDataSetMeta,
} from '../mocks/dataSetMeta';
import {
  absenceRatesDataSet,
  absenceRatesByCharacteristicsDataSet,
  permanentExclusionsDataSet,
  permanentExclusionsDataSets,
  pupilAbsenceDataSets,
} from '../mocks/dataSets';
import { ApiErrorViewModel } from '../schema';
import filterDataSetResults from '../utils/filterDataSetResults';
import normalizeApiErrors from '../utils/normalizeApiErrors';
import paginateResults from '../utils/paginateResults';

const apiSpec = path.resolve(__dirname, '../openapi.yaml');

const app = express();

// Middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(
  OpenApiValidator.middleware({
    apiSpec,
    validateApiSpec: true,
    validateRequests: {
      allowUnknownQueryParameters: true,
    },
    validateResponses: true,
    ignorePaths: /\/docs/,
  })
);

app.use('/docs', express.static(apiSpec));

// Routes

app.get('/api/v1/publications', (req, res) => {
  res.status(200).json(
    paginateResults(publications, {
      ...req.query,
      baseUrl: '/api/publications',
    })
  );
});

app.get('/api/v1/publications/:publicationId/data-sets', (req, res) => {
  switch (req.params.publicationId) {
    case pupilAbsencePublication.id:
      res.status(200).json(pupilAbsenceDataSets);
      break;
    case permanentExclusionsPublication.id:
      res.status(200).json(permanentExclusionsDataSets);
      break;
    default:
      res.status(404).json(notFoundError());
  }
});

app.get('/api/v1/data-sets/:dataSetId/meta', (req, res) => {
  switch (req.params.dataSetId) {
    case absenceRatesDataSet.id:
      res.status(200).json(absenceRatesDataSetMeta);
      break;
    case absenceRatesByCharacteristicsDataSet.id:
      res.status(200).json(absenceRatesByCharacteristicsDataSetMeta);
      break;
    case permanentExclusionsDataSet.id:
      res.status(200).json(permanentExclusionsDataSetMeta);
      break;
    default:
      res.status(404).json(notFoundError());
  }
});

app.post('/api/v1/data-sets/:dataSetId/query', (req, res) => {
  switch (req.params.dataSetId) {
    case absenceRatesDataSet.id:
      res
        .status(200)
        .json(filterDataSetResults(absenceRatesDataSetData, req.body));
      break;
    case absenceRatesByCharacteristicsDataSet.id:
      res
        .status(200)
        .json(
          filterDataSetResults(
            absenceRatesByCharacteristicsDataSetData,
            req.body
          )
        );
      break;
    case permanentExclusionsDataSet.id:
      res
        .status(200)
        .json(filterDataSetResults(permanentExclusionsDataSetData, req.body));
      break;
    default:
      res.status(404).json(notFoundError());
  }
});

app.get('/api/v1/data-sets/:dataSetId/file', (req, res) => {
  switch (req.params.dataSetId) {
    case absenceRatesDataSet.id:
    case absenceRatesByCharacteristicsDataSet.id:
    case permanentExclusionsDataSet.id:
      res
        .status(200)
        .sendFile(path.resolve(__dirname, '../mocks/dataSetFile.zip'));
      break;
    default:
      res.status(404).json(notFoundError());
  }
});

// Error handling

const errorHandler: ErrorRequestHandler = (err, req, res, _) => {
  console.error(err);
  res.status(err.status || 500).json({
    status: err.status,
    title: err.message,
    type: err.name,
    errors: normalizeApiErrors(err.errors),
  });
};

app.use(errorHandler);

const port = 3000;

app.listen(port, () => console.log(`Server is running on port ${port}`));

export default app;

function notFoundError(): ApiErrorViewModel {
  return {
    status: 404,
    type: 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.4',
    title: 'Not Found',
  };
}
