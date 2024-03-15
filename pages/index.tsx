import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
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

        <div className={styles.postGrid}>
          {posts.map((post) => (
            <div key={post.id} className={styles.postCard}>
<Link href={`/${post.id.split(':').join('/')}`}>
  <a>
    {post.id && (
      <>
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
      </>
    )}
  </a>
</Link>
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




import React from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

export const getStaticProps: GetStaticProps = async () => {
  const endpoint = process.env.GRAPHQL_ENDPOINT as string;
  const graphQLClient = new GraphQLClient(endpoint);

  const query = gql`
    {
      posts(first: 10, where: { orderby: { field: DATE, order: DESC } }) {
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
          date
        }
      }
    }
  `;

  const data = await graphQLClient.request(query);
  const posts = data.posts.nodes;

  return {
    props: {
      posts,
    },
    revalidate: 600, // Regenerate page every 10 minutes
  };
};

interface Post {
  id: string;
  title: string;
  excerpt: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  categories: {
    nodes: {
      name: string;
    }[];
  };
  date: string;
}

interface HomeProps {
  posts: Post[];
}

const Home: React.FC<HomeProps> = ({ posts }) => {
  return (
    <div>
      <Head>
        <title>Danh sách bài viết mới nhất</title>
        <meta name="description" content="Danh sách bài viết mới nhất" />
      </Head>

      <main>
        <h1>Danh sách bài viết mới nhất</h1>
        <div>
          {posts.map((post) => (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <img src={post.featuredImage.node.sourceUrl} alt={post.featuredImage.node.altText} />
              <p>Danh mục: {post.categories.nodes.map((category) => category.name).join(', ')}</p>
              <p>Ngày đăng: {new Date(post.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
