import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

// Interface and types
interface Post {
  //...
} 

interface HomeProps {
  posts: Post[];
  totalPages: number;
}

// Header
const Header = () => (
  <header>
    <img src="/logo.png"/>
  </header>
)

const Home = ({posts, totalPages}: HomeProps) => {

  const [currentPage, setCurrentPage] = useState(1);

  const handlePrevPage = () => {
    if(currentPage > 1){
      setCurrentPage(currentPage - 1) 
    }
  }

  const handleNextPage = () => {
    if(currentPage < totalPages){
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div>
      <Header />

      <main>
        
        {/* Posts */}

        <button onClick={handlePrevPage}>Prev</button>

        <button onClick={handleNextPage}>Next</button>
      </main>
    </div>
  )
}

// Server Side Props
export const getServerSideProps: GetServerSideProps = async () => {

  const query = gql`
    query GetPosts($limit: Int, $skip: Int) {
      posts(first: $limit, skip: $skip) {
        nodes {
          // fields
        }
        pageInfo {
          totalPages
        } 
      }
    }
  `;

  // Request data

  return {
    props: {
      //props
    }
  }

}

export default Home
