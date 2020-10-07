import Head from 'next/head'
import Link from 'next/link'
import Date from '../components/date'
import Counter from '../components/counter'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedCanopyData, getSortedPostsData } from '../lib/posts'


export default function Home({ allPostsData, allCanopiesData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Hello, I'm Robbert, testing Nextjs, to maybe use for the Skydive Kompasroos!</p>
        <p>
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
        <Counter />
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
     <li className={utilStyles.listItem} key={id}>
     <Link href={`/posts/${id}`}>
       <a>{title}</a>
     </Link>
     <br />
     <small className={utilStyles.lightText}>
       <Date dateString={date} />
     </small>
   </li>
   
          ))}
        </ul>
      </section>

      <section>
        <ul className={utilStyles.list}>
          {allCanopiesData.map(({slug, name, displaycategory, manufacturername}) => (
            <li className={utilStyles.listItem} key={slug}>
              {name}
              <br />
              <small className={utilStyles.lightText}>
                {manufacturername}
              </small>
            </li>
          ))}
        </ul>
      </section>

    </Layout>
  )
}


export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  const allCanopiesData = getSortedCanopyData()
  console.log(allCanopiesData)
  return {
    props: {
      allPostsData,
      allCanopiesData
    }
  }
}
