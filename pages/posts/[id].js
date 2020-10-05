import Layout from '../../components/layout'
import Date from '../../components/date'
import Head from 'next/head'
import { getAllPostIds, getPostData } from '../../lib/posts'

export default function Post({ postData }) {
  return <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
      {postData.title}
      <br />
      {postData.id}
      <br />
      <Date dateString={postData.date} />
      <br />
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
  </Layout>
}


export async function getStaticPaths() {
    const paths = getAllPostIds()
    return {
      paths,
      fallback: false
    }
  }
  

  export async function getStaticProps({ params }) {
    const postData = await getPostData(params.id)
    return {
      props: {
        postData
      }
    }
  }
  