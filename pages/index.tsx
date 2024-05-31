import { GetServerSideProps, GetServerSidePropsResult } from 'next'
import { DrupalNode } from "next-drupal"
import { drupal } from "lib/drupal"
import { Layout } from "components/layout"
import { NodeArticleTeaser } from "components/node--article--teaser"

const timeZoneToCountryMap = {
  "CA": {
    "name": "Canada",
    "zones": [
      "America/St_Johns",
      "America/Halifax",
      "America/Glace_Bay",
      "America/Moncton",
      "America/Goose_Bay",
      "America/Toronto",
      "America/Iqaluit",
      "America/Winnipeg",
      "America/Resolute",
      "America/Rankin_Inlet",
      "America/Regina",
      "America/Swift_Current",
      "America/Edmonton",
      "America/Cambridge_Bay",
      "America/Inuvik",
      "America/Dawson_Creek",
      "America/Fort_Nelson",
      "America/Whitehorse",
      "America/Dawson",
      "America/Vancouver",
      "America/Panama",
      "America/Puerto_Rico",
      "America/Phoenix",
      "America/Blanc-Sablon",
      "America/Atikokan",
      "America/Creston"
    ]
  },
  "LK": {
    "name": "Sri Lanka",
    "zones": [
      "Asia/Colombo"
    ]
  },
  "AU": {
    "name": "Australia",
    "zones": [
      "Australia/Lord_Howe",
      "Antarctica/Macquarie",
      "Australia/Hobart",
      "Australia/Melbourne",
      "Australia/Sydney",
      "Australia/Broken_Hill",
      "Australia/Brisbane",
      "Australia/Lindeman",
      "Australia/Adelaide",
      "Australia/Darwin",
      "Australia/Perth",
      "Australia/Eucla"
    ]
  }
};
function getCountryCodeByTimeZone(timeZone: string) {
  for (const [countryCode, countryData] of Object.entries(timeZoneToCountryMap)) {
    if (countryData.zones.includes(timeZone)) {
      return countryCode;
    }
  }
  return null;
}

interface IndexPageProps {
  nodes: DrupalNode[];
}

export default function IndexPage({ nodes}: IndexPageProps) {

  return (
    <Layout>
      <div>
        {nodes?.length ? (
          nodes.map((node) => (
            <div key={node.id}>
              <NodeArticleTeaser node={node} />
              <hr className="my-20" />
            </div>
          ))
        ) : (
          <p className="py-4">No nodes found</p>
        )}
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<IndexPageProps> = async (context): Promise<GetServerSidePropsResult<IndexPageProps>> => {
  
  const timeZone= Intl.DateTimeFormat().resolvedOptions().timeZone;
  const country = getCountryCodeByTimeZone(timeZone);

  let filterParams = {  
    "filter[status]": 1,
    "fields[node--article]": "title,path,field_image,uid,created,field_tags",
    include: "field_image,uid,field_tags",
    sort: "-created",
  };

  if (country) {
    filterParams["filter[field_tags.name]"] = country;
  }

  const nodes = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
    "node--article",
    context,
    { params: filterParams }
  );

  return {
    props: {
      nodes,
    },
  };
}