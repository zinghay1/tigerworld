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
  hasNextPage: boolean;
  endCursor: string;
}

const Home: NextPage<HomeProps> = ({ posts, hasNextPage, endCursor }) => {
  const router = useRouter();

  const loadMorePosts = () => {
    router.push({
      pathname: '/',
      query: { after: endCursor },
    });
  };

  return (
    <div className={styles.container}>
     			<Head>
  {/* Ẩn tiêu đề và tóm tắt */}
  {/* <meta property="og:title" content={post.title} />
    
   */}

  <meta property="og:url" content={post.featuredImage.node.sourceUrl} />
  <meta property="og:description" content="ㅤ" />
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:site_name" content={host.split('.')[0]} />
  <meta property="article:published_time" content={post.dateGmt} />
  <meta property="article:modified_time" content={post.modifiedGmt} />
  <meta property="og:image" content={post.featuredImage.node.sourceUrl} />
  <title> </title>
</Head>

      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>Blogs News</h1>
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
        {hasNextPage && (
          <button onClick={loadMorePosts}>Load More</button>
        )}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const endpoint = process.env.GRAPHQL_ENDPOINT as string;
  const graphQLClient = new GraphQLClient(endpoint);
  const baseUrl = `https://${req.headers.host}`;
  const first = 10; // Number of posts per page
  const after = query.after || null;

  const queryParameters = {
    first,
    after,
  };

  const query = gql`
    query GET_POSTS($first: Int, $after: String) {
      posts(first: $first, after: $after, where: { orderby: { field: MODIFIED, order: DESC } }) {
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
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  `;

  const data = await graphQLClient.request(query, queryParameters);
  const posts: Post[] = data.posts.nodes.map((post: any) => ({
    ...post,
    link: `${baseUrl}/${post.uri}`,
  }));

  return {
    props: {
      posts,
      hasNextPage: data.posts.pageInfo.hasNextPage,
      endCursor: data.posts.pageInfo.endCursor,
    },
  };
};

export default Home;

// Header component
const Header = () => (
  <header className={styles.header}>
    <nav>
      <Link href="/">
        <a>Trang chủ</a>
      </Link>
    </nav>
  </header>
);
