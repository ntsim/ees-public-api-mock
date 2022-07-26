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
  absenceRatesSubjectData,
  absenceRatesByCharacteristicsSubjectData,
  permanentExclusionsSubjectData,
} from '../mocks/subjectData';
import {
  absenceRatesSubjectMeta,
  absenceRatesByCharacteristicsSubjectMeta,
  permanentExclusionsSubjectMeta,
} from '../mocks/subjectMeta';
import {
  absenceRatesSubject,
  absenceRatesByCharacteristicsSubject,
  permanentExclusionsSubject,
  permanentExclusionsSubjects,
  pupilAbsenceSubjects,
} from '../mocks/subjects';
import { ApiErrorViewModel } from '../schema';
import filterSubjectDataResults from '../utils/filterSubjectDataResults';
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

app.get('/api/v1/publications/:publicationId/subjects', (req, res) => {
  switch (req.params.publicationId) {
    case pupilAbsencePublication.id:
      res.status(200).json(pupilAbsenceSubjects);
      break;
    case permanentExclusionsPublication.id:
      res.status(200).json(permanentExclusionsSubjects);
      break;
    default:
      res.status(404).json(notFoundError());
  }
});

app.get('/api/v1/subjects/:subjectId/meta', (req, res) => {
  switch (req.params.subjectId) {
    case absenceRatesSubject.id:
      res.status(200).json(absenceRatesSubjectMeta);
      break;
    case absenceRatesByCharacteristicsSubject.id:
      res.status(200).json(absenceRatesByCharacteristicsSubjectMeta);
      break;
    case permanentExclusionsSubject.id:
      res.status(200).json(permanentExclusionsSubjectMeta);
      break;
    default:
      res.status(404).json(notFoundError());
  }
});

app.post('/api/v1/subjects/:subjectId/data', (req, res) => {
  switch (req.params.subjectId) {
    case absenceRatesSubject.id:
      res
        .status(200)
        .json(filterSubjectDataResults(absenceRatesSubjectData, req.body));
      break;
    case absenceRatesByCharacteristicsSubject.id:
      res
        .status(200)
        .json(
          filterSubjectDataResults(
            absenceRatesByCharacteristicsSubjectData,
            req.body
          )
        );
      break;
    case permanentExclusionsSubject.id:
      res
        .status(200)
        .json(
          filterSubjectDataResults(permanentExclusionsSubjectData, req.body)
        );
      break;
    default:
      res.status(404).json(notFoundError());
  }
});

app.get('/api/v1/subjects/:subjectId/data-file', (req, res) => {
  switch (req.params.subjectId) {
    case absenceRatesSubject.id:
    case absenceRatesByCharacteristicsSubject.id:
    case permanentExclusionsSubject.id:
      res
        .status(200)
        .sendFile(path.resolve(__dirname, '../mocks/subjectDataFile.zip'));
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
