import path from 'path';
import {
  benchmarkETDetailedReorderedDataSet,
  spcEthnicityLanguageDataSet,
  spcYearGroupGenderDataSet,
} from '../mocks/dataSets';

const dataSetDirs = {
  [spcEthnicityLanguageDataSet.id]: path.resolve(
    __dirname,
    '../data/spc_pupils_ethnicity_and_language'
  ),
  [spcYearGroupGenderDataSet.id]: path.resolve(
    __dirname,
    '../data/spc_pupils_fsm_ethnicity_yrgp'
  ),
  [benchmarkETDetailedReorderedDataSet.id]: path.resolve(
    __dirname,
    '../data/e-and-t-geography-detailed_6years_reordered'
  ),
};

export default function getDataSetDir(dataSetId: string) {
  const dataSetDir = dataSetDirs[dataSetId];

  if (!dataSetDir) {
    throw new Error(`No data set for this id: ${dataSetId}`);
  }

  return dataSetDir;
}
