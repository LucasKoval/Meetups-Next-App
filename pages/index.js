import Head from 'next/head'
import { MongoClient } from 'mongodb'
import MeetupList from '../components/meetups/MeetupList'

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>NextJS Meetups App</title>
        <meta name="description" content="Browse a list of highly active React meetups!" />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  )
}

// INCREMENTAL STATIC GENERATION APPROACH (SSG)
export async function getStaticProps() {
  // Fetch data from an API
  const client = await MongoClient.connect(
    'mongodb+srv://LucasKoval:103497610Xregmdb@cluster0.ddley.mongodb.net/meetups?retryWrites=true&w=majority'
  )
  const db = client.db()
  const meetupsCollection = db.collection('meetups')

  const meetups = await meetupsCollection.find().toArray()
  client.close()

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10, //--> This page will be re-pregenerated every 10 seconds after deployment (INCREMENTAL STATIC GENERATION)
  }
}

/* SERVER-SIDE RENDER APPROACH (SSR)
export async function getServerSideProps(context) {
  const req = context.req
  const res = context.res
  // Fetch data from an API

  return {
    props: {
      meetups: EXAMPLE_MEETUPS,
    },
  }
}
*/

export default HomePage
