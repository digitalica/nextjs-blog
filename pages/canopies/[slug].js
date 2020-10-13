import Layout from '../../components/layout'
import Head from 'next/head'
import { getAllCanopySlugs, getCanopyData } from '../../lib/canopies'

export default function Post({ postData }) {
  return <Layout>
      <Head>
        <title>{postData.name}</title>
        <meta name="og:title" content={"Skydive kompasroos" + postData.name } />

        <meta
          name="description"
          content={postData.name}
        />

      </Head>
      <article>
      {postData.name}
      <br />
      Category {postData.category}
      <br />
      first year {postData.firstyearofproduction}
      <br />
      <br />



      
      url: {postData.url}
      </article>
  </Layout>
}


export async function getStaticPaths() {
    const paths = getAllCanopySlugs()
    return {
      paths,
      fallback: false
    }
  }
  

export async function getStaticProps({ params }) {
const postData = await getCanopyData(params.slug)
return {
    props: {
    postData
    }
}
}
  
