import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { GraphQLClient, gql } from 'graphql-request';
import styles from '../styles/Home.module.css';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    }
  };
  categories: {
    nodes: {
      name: string;
    }[];
  };
  modifiedGmt: string;
}

interface HomeProps {
  posts: Post[];
}

const Home: NextPage<HomeProps> = ({ posts }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Recent Posts</title>
        <meta name="description" content="Recent blog posts" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Recent Posts</h1>

        <div className={styles.grid}>
          {posts.map((post) => (
            <div key={post.id} className={styles.card}>
              <img
                src={post.featuredImage.node.sourceUrl}
                alt={post.featuredImage.node.altText || post.title}
              />
              <h2>{post.title}</h2>
              <p>
                {post.categories.nodes.map((category) => category.name).join(', ')}
              </p>
              <p>{new Date(post.modifiedGmt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const endpoint = process.env.GRAPHQL_ENDPOINT as string;
  const graphQLClient = new GraphQLClient(endpoint);

  const query = gql`
    {
      posts(first: 20, where: { orderby: { field: MODIFIED, order: DESC } }) {
        nodes {
          id
          title
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
            }
          }
          modifiedGmt
        }
      }
    }
  `;

  const data = await graphQLClient.request(query);
  const posts: Post[] = data.posts.nodes;

  return {
    props: {
      posts,
    },
    revalidate: 600, // Regenerate page every 10 minutes
  };
};

export default Home;
