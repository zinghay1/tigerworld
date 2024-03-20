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
  const router = useRouter();
  const { page } = router.query;

  // Số bài viết hiển thị trên mỗi trang
  const postsPerPage = 12;

  // Tính toán số trang
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Lấy chỉ mục bắt đầu và kết thúc của bài viết trang hiện tại
  const startIndex = (parseInt(page as string) - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;

  // Lấy danh sách bài viết trang hiện tại
  const currentPosts = posts.slice(startIndex, endIndex);

  return (
    <div className={styles.container}>
      <Head>
        <title>My Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <Link href="/">
          <a>
            <img src="/logo.png" alt="Home" className={styles.logo} />
          </a>
        </Link>
      </header>

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

        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <Link href={`/?page=${index + 1}`} key={index}>
              <a className={parseInt(page as string) === index + 1 ? styles.activePage : undefined}>{index + 1}</a>
            </Link>
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
