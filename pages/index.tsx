import Head from "next/head"
import { GetStaticPropsResult } from "next"
import { DrupalNode } from "next-drupal"
import axios from 'axios';


import { drupal } from "lib/drupal"
import { Layout } from "components/layout"
import { NodeArticleTeaser } from "components/node--article--teaser"

interface IndexPageProps {
  nodes: DrupalNode[];
  country: string;
}

export async function getCountryFromIP(ip: string) {
  try {
    const response = await axios.get(`https://ipinfo.io/${ip}/country`);
    const country = response.data.trim();
    return country;
  } catch (error) {
    console.error('Error fetching country:', error);
    return null;
  }
}

export default function IndexPage({ nodes, country }: IndexPageProps) {
  return (
    <Layout>
      {country ? (
        <p style={{ fontSize: '20px', bottom: '40px' }}>Your country: {country}</p>
      ) : (
        <p style={{ fontSize: '20px', bottom: '40px' }}>Loading...</p>
      )}
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

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<IndexPageProps>> {

  let country = '';

  try {
    const { data } = await axios.get(`http://localhost:3000/api/get-ip`);
    let ip = data.ip;
    country = await getCountryFromIP(ip);
  } catch (error) {
    console.error('Error fetching IP or country:', error);
  }

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
  )
  return {
    props: {
      nodes,
      country
    },
  }
}