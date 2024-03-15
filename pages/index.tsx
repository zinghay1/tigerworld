import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

export const getServerSideProps: GetServerSideProps = async () => {
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
          link
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
  link: string;
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
              <Link href={post.link}>
                <a>
                  <h2>{post.title}</h2>
                </a>
              </Link>
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
