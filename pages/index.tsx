import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
  uri: string;
  link: string;
}

interface HomeProps {
  posts: Post[];
}

const Home: NextPage<HomeProps> = ({ posts }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Blog vercel by Park Ji Sung</title>
        <meta name="description" content="Home" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
        <a href={posts[0]?.url} rel="home">
          {host.split('.')[0]}
        </a>  
          </h1>
        <div className={styles.postGrid}>
          {posts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <Link href={post.link}>
                <a>
                  <img
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.featuredImage.node.altText || post.title}
                    className={styles.postImage}
                  />
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <div className={styles.postMeta}>
                    <span className={styles.postCategory}>
                      {post.categories.nodes.map((category) => category.name).join(', ')}
                    </span>
                    <span className={styles.postDate}>{new Date(post.modifiedGmt).toLocaleDateString()}</span>
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const endpoint = process.env.GRAPHQL_ENDPOINT as string;
  const graphQLClient = new GraphQLClient(endpoint);
  const baseUrl = `https://${req.headers.host}`;

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
          uri
        }
      }
    }
  `;

  const data = await graphQLClient.request(query);
  const posts: Post[] = data.posts.nodes.map((post: any) => ({
    ...post,
    link: `${baseUrl}/${post.uri}`,
  }));

  return {
    props: {
      posts,
    },
  };
};

export default Home;
