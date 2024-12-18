import { useCallback, useEffect, useMemo, useState } from "react";

// USER API
// https://jsonplaceholder.typicode.com/users

// POST API
// https://jsonplaceholder.typicode.com/posts

interface User {
  id: string;
  name: string;
}

interface Post {
  id: string;
  userId: string;
  title: string;
}

interface PostWithAuthor extends Post {
  user: User | undefined;
}

const usePosts = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState([]);

  // setIsLoading(true);

  useEffect(() => {
    async function getData() {
      const url = "https://jsonplaceholder.typicode.com/posts";
      try {
        setIsLoading(true);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error(error?.message);
      }
      setIsLoading(false);
    }
    getData();
  }, []);

  // TODO: Filter posts with author by post title OR author name based on the given query

  return {
    posts: data as PostWithAuthor[],
    isLoading: isLoading,
  };
};

const useUsers = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState([]);

  // setIsLoading(true);

  useEffect(() => {
    async function getData() {
      const url = "https://jsonplaceholder.typicode.com/users";
      try {
        setIsLoading(true);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error(error?.message);
      }
      setIsLoading(false);
    }
    getData();
  }, []);

  // TODO: Filter posts with author by post title OR author name based on the given query

  return {
    users: data as User[],
    isLoading: isLoading,
  };
};

interface PostCardProps {
  post: PostWithAuthor;
  userName: string | null;
}

function PostCard({ post, userName }: PostCardProps) {
  return (
    <div style={{ display: "flex" }}>
      {/*TODO: Add an image here 200x200 by keeping to enhance card just UI -> "https://picsum.photos/200/300" */}
      {/*...*/}
      <img src={`https://picsum.photos/200/300?post=${post.id}`} alt="picsum" />
      <div>{post.title} - </div>
      <div>{userName ?? "Unknown Author"}</div>
    </div>
  );
}

export default function App() {
  const [searchText, setSearchText] = useState("");
  const [filterResults, setFilterResults] = useState<PostWithAuthor[]>([]);

  // TODO: Optimise usePost to run for query updates after 500ms of user input
  const { posts } = usePosts();
  const { users } = useUsers();

  const userNameMap = useMemo(() => {
    return users.reduce((acc, user) => ({ ...acc, [user.id]: user.name }), {});
  }, [users]);

  const onChangeSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    []
  );

  useEffect(() => {
    setTimeout(() => {
      const newPosts = posts.filter(
        (post) =>
          post.title.includes(searchText) ||
          (userNameMap[post.id as keyof typeof userNameMap] ?? "").includes(
            searchText
          )
      );
      setFilterResults(newPosts);
    }, 500);
  }, [posts, searchText, userNameMap]);

  return (
    <div className="App">
      {/*  TODO: Implement query controller */}
      <input
        placeholder="Search post"
        value={searchText}
        onChange={onChangeSearch}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* TODO: Render the PostCard for each post */}
        {filterResults.map((post) => (
          <PostCard
            post={post}
            userName={userNameMap[post.id as keyof typeof userNameMap]}
          />
        ))}
      </div>
    </div>
  );
}
