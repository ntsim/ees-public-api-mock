import path from 'path';
import {
  benchmarkETDetailedReorderedDataSet,
  benchmarkLtdDmDataSet,
  benchmarkNatDataSet,
  benchmarkQuaDataSet,
  spcEthnicityLanguageDataSet,
  spcYearGroupGenderDataSet,
} from '../mocks/dataSets';

export const dataSetDirs = {
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
  [benchmarkQuaDataSet.id]: path.resolve(__dirname, '../data/qua01'),
  [benchmarkNatDataSet.id]: path.resolve(__dirname, '../data/nat01'),
  [benchmarkLtdDmDataSet.id]: path.resolve(
    __dirname,
    '../data/ltd_dm_201415_inst'
  ),
};

export default function getDataSetDir(dataSetId: string) {
  const dataSetDir = dataSetDirs[dataSetId];

  if (!dataSetDir) {
    throw new Error(`No data set for this id: ${dataSetId}`);
  }

  return dataSetDir;
}
