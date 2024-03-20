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
  const postsPerPage = 10;

  // Tính toán các bài viết hiển thị trên trang hiện tại
  const startIndex = (Number(page) - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  // Tính toán số trang
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className={styles.container}>
      <Head>
        <title>Blogs News</title>
      </Head>

      <header className={styles.header}>
        <Link href="/">
          <a>
            <img src="/path/to/logo.png" alt="Home" className={styles.logo} />
          </a>
        </Link>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Blogs News</h1>
        <div className={styles.postGrid}>
          {currentPosts.map((post) => (
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
            <Link key={index} href={`/?page=${index + 1}`}>
              <a className={Number(page) === index + 1 ? styles.activePage : styles.page}>{index + 1}</a>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // Cùng phần code trước đó...

  return {
    props: {
      posts,
    },
  };
};

export default Home;
