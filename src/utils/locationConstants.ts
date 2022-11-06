import { invert } from 'lodash';
import { GeographicLevel } from '../schema';

export interface GeographicLevelCols {
  code: string;
  name: string;
  other?: string[];
}

export const geographicLevelColumns: Record<
  GeographicLevel,
  GeographicLevelCols
> = {
  Country: { code: 'country_code', name: 'country_name' },
  EnglishDevolvedArea: {
    code: 'english_devolved_area_code',
    name: 'english_devolved_area_name',
  },
  Institution: { code: 'institution_id', name: 'institution_name' },
  LocalAuthority: {
    code: 'new_la_code',
    name: 'la_name',
    other: ['old_la_code'],
  },
  LocalAuthorityDistrict: { code: 'lad_code', name: 'lad_name' },
  LocalEnterprisePartnership: {
    code: 'local_enterprise_partnership_code',
    name: 'local_enterprise_partnership_name',
  },
  MayoralCombinedAuthority: {
    code: 'mayoral_combined_authority_code',
    name: 'mayoral_combined_authority_name',
  },
  MultiAcademyTrust: { code: 'trust_id', name: 'trust_name' },
  OpportunityArea: {
    code: 'opportunity_area_code',
    name: 'opportunity_area_name',
  },
  ParliamentaryConstituency: { code: 'pcon_code', name: 'pcon_name' },
  PlanningArea: { code: 'planning_area_code', name: 'planning_area_name' },
  Provider: { code: 'provider_ukprn', name: 'provider_name' },
  Region: { code: 'region_code', name: 'region_name' },
  RscRegion: { code: 'rsc_region_code', name: 'rsc_region_name' },
  School: { code: 'school_urn', name: 'school_name' },
  Sponsor: { code: 'sponsor_id', name: 'sponsor_name' },
  Ward: { code: 'ward_code', name: 'ward_name' },
};

export const geographicLevelCsvLabels: Record<GeographicLevel, string> = {
  Country: 'National',
  EnglishDevolvedArea: 'English devolved area',
  Institution: 'Institution',
  LocalAuthority: 'Local authority',
  LocalAuthorityDistrict: 'Local authority district',
  LocalEnterprisePartnership: 'Local enterprise partnership',
  MayoralCombinedAuthority: 'Mayoral combined authority',
  MultiAcademyTrust: 'MAT',
  OpportunityArea: 'Opportunity area',
  ParliamentaryConstituency: 'Parliamentary constituency',
  PlanningArea: 'Planning area',
  Provider: 'Provider',
  Region: 'Regional',
  RscRegion: 'RSC region',
  School: 'School',
  Sponsor: 'Sponsor',
  Ward: 'Ward',
};

export const csvLabelsToGeographicLevels = invert(
  geographicLevelCsvLabels
) as Record<string, GeographicLevel>;
