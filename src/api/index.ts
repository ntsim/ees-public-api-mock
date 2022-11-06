import bodyParser from 'body-parser';
import express, { ErrorRequestHandler, Request, Response } from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import path from 'path';
import {
  absenceRatesByCharacteristicsDataSetData,
  absenceRatesDataSetData,
  permanentExclusionsDataSetData,
} from '../mocks/dataSetData';
import {
  absenceRatesByCharacteristicsDataSetMeta,
  absenceRatesDataSetMeta,
  permanentExclusionsDataSetMeta,
} from '../mocks/dataSetMeta';
import {
  absenceRatesByCharacteristicsDataSet,
  absenceRatesDataSet,
  permanentExclusionsDataSet,
  permanentExclusionsDataSets,
  pupilAbsenceDataSets,
  spcDataSets,
  spcEthnicityLanguageDataSet,
  spcYearGroupGenderDataSet,
} from '../mocks/dataSets';
import {
  permanentExclusionsPublication,
  publications,
  pupilAbsencePublication,
  spcPublication,
} from '../mocks/publications';
import { ApiErrorViewModel, DataSetResultsViewModel } from '../schema';
import dataSetResultsToCsv from '../utils/dataSetResultsToCsv';
import filterDataSetMeta from '../utils/filterDataSetMeta';
import filterDataSetResults from '../utils/filterDataSetResults';
import getDataSetMeta from '../utils/getDataSetMeta';
import normalizeApiErrors from '../utils/normalizeApiErrors';
import paginateResults from '../utils/paginateResults';
import queryDataSetData from '../utils/queryDataSetData';

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
    validateFormats: false,
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
  const { search } = req.query;
  const filteredPublications =
    typeof search === 'string'
      ? publications.filter((publication) =>
          publication.title.toLowerCase().includes(search.toLowerCase())
        )
      : publications;

  res.status(200).json(
    paginateResults(filteredPublications, {
      ...req.query,
      baseUrl: '/api/v1/publications',
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
    case spcPublication.id:
      res.status(200).json(spcDataSets);
      break;
    default:
      res.status(404).json(notFoundError());
  }
});

app.get('/api/v1/data-sets/:dataSetId/meta', async (req, res) => {
  const showFilterIds = Boolean(req.query.showFilterIds);

  switch (req.params.dataSetId) {
    case absenceRatesDataSet.id:
      res
        .status(200)
        .json(filterDataSetMeta(absenceRatesDataSetMeta, { showFilterIds }));
      break;
    case absenceRatesByCharacteristicsDataSet.id:
      res.status(200).json(
        filterDataSetMeta(absenceRatesByCharacteristicsDataSetMeta, {
          showFilterIds,
        })
      );
      break;
    case permanentExclusionsDataSet.id:
      res.status(200).json(
        filterDataSetMeta(permanentExclusionsDataSetMeta, {
          showFilterIds,
        })
      );
      break;
    case spcEthnicityLanguageDataSet.id: {
      const meta = await getDataSetMeta(spcEthnicityLanguageDataSet.id);

      res.status(200).json(meta);
      break;
    }
    case spcYearGroupGenderDataSet.id: {
      const meta = await getDataSetMeta(spcYearGroupGenderDataSet.id);

      res.status(200).json(meta);
      break;
    }
    default:
      res.status(404).json(notFoundError());
  }
});

app.post('/api/v1/data-sets/:dataSetId/query', async (req, res) => {
  switch (req.params.dataSetId) {
    case absenceRatesDataSet.id:
      handleMockDataSetQuery(req, res, absenceRatesDataSetData);
      break;
    case absenceRatesByCharacteristicsDataSet.id:
      handleMockDataSetQuery(
        req,
        res,
        absenceRatesByCharacteristicsDataSetData
      );
      break;
    case permanentExclusionsDataSet.id:
      handleMockDataSetQuery(req, res, permanentExclusionsDataSetData);
      break;
    case spcEthnicityLanguageDataSet.id:
      await handleDatabaseDataSetQuery(
        req,
        res,
        spcEthnicityLanguageDataSet.id
      );
      break;
    case spcYearGroupGenderDataSet.id:
      await handleDatabaseDataSetQuery(req, res, spcYearGroupGenderDataSet.id);
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

function handleMockDataSetQuery(
  req: Request,
  res: Response,
  results: DataSetResultsViewModel
) {
  res.status(200);

  const filteredResults = filterDataSetResults(results, req.body);

  if (req.headers.accept?.toLowerCase() !== 'text/csv') {
    const body: DataSetResultsViewModel = {
      ...filteredResults,
      meta: req.body.showMeta ? filteredResults.meta : undefined,
    };

    return res.json(body);
  }

  res.setHeader('Content-Type', 'text/csv');
  res.send(dataSetResultsToCsv(filteredResults));
}

async function handleDatabaseDataSetQuery(
  req: Request,
  res: Response,
  dataSetId: string
) {
  const results = await queryDataSetData(dataSetId, req.body);

  res.status(200).send(results);
}
