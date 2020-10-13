import Layout from '../../components/layout'
import Head from 'next/head'
import { getAllManufacturerSlugs, getManufacturerData } from '../../lib/canopies'

export default function Post({ postData }) {
  return <Layout>
      <Head>
        <title>{postData.name}</title>
        <meta name="og:title" content={"Skydive kompasroos " + postData.name } />

        <meta
          name="description"
          content={"Canopy manufacturer " +postData.name}
        />
      </Head>
      <article>
      {postData.name}
      <br />
      {postData.countrycode}
      <br />
      {postData.url}
      </article>
  </Layout>
}


export async function getStaticPaths() {
    const paths = getAllManufacturerSlugs()
    return {
      paths,
      fallback: false
    }
  }
  

export async function getStaticProps({ params }) {
const postData = await getManufacturerData(params.slug)
return {
    props: {
    postData
    }
}
}
  
