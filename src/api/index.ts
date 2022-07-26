import bodyParser from 'body-parser';
import compression from 'compression';
import express, { ErrorRequestHandler, Request, Response } from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import path from 'path';
import { allDataSets, spcDataSets } from '../mocks/dataSets';
import { publications, spcPublication } from '../mocks/publications';
import { ApiErrorViewModel } from '../schema';
import { dataSetDirs } from '../utils/getDataSetDir';
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
app.use(compression());
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
    case spcPublication.id:
      res.status(200).json(spcDataSets);
      break;
    default:
      res.status(404).json(notFoundError());
  }
});

app.get('/api/v1/data-sets/:dataSetId/meta', async (req, res) => {
  if (dataSetDirs[req.params.dataSetId]) {
    res.status(200).json(await getDataSetMeta(req.params.dataSetId));
    return;
  }

  res.status(404).json(notFoundError());
  return;
});

app.post('/api/v1/data-sets/:dataSetId/query', async (req, res) => {
  if (dataSetDirs[req.params.dataSetId]) {
    return await handleDatabaseDataSetQuery(req, res, req.params.dataSetId);
  }

  res.status(404).json(notFoundError());
});

app.get('/api/v1/data-sets/:dataSetId/file', (req, res) => {
  if (allDataSets.some((dataSet) => dataSet.id === req.params.dataSetId)) {
    return res
      .status(200)
      .sendFile(path.resolve(__dirname, '../mocks/dataSetFile.zip'));
  }

  res.status(404).json(notFoundError());
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

async function handleDatabaseDataSetQuery(
  req: Request,
  res: Response,
  dataSetId: string
) {
  const results = await queryDataSetData(dataSetId, req.body, {
    debug: typeof req.query.debug !== 'undefined',
  });

  // TODO - Implement CSV response

  res.status(200).send(results);
}
