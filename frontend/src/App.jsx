import { Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import { css, Global } from "@emotion/react";

// import { Global, css } from "@emotion/react";

const scrollbarStyles = css`
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background-color: #f0f0f0; /* لون خلفية التمرير (خفيف) */
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #333; /* لون المقبض الأساسي */
    border-radius: 6px;
    transition: background-color 0.3s ease; /* تأثير انسياب على اللون */
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #5a5a5a; /* لون المقبض عند التمرير */
  }

  ::-webkit-scrollbar-thumb:active {
    background-color: #8e8e8e; /* لون المقبض عند الضغط عليه */
  }
`;

function App() {
  const user = useRecoilValue(userAtom);
  // console.log(user);

  return (
    <Container maxWidth={"620px"}>
      <Global styles={scrollbarStyles} />
      <Header />

      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/:userName/updateProfile"
          element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
        />

        <Route
          path="/:userName"
          element={
            user ? (
              <>
                <UserPage />
                <CreatePost />
              </>
            ) : (
              <AuthPage />
            )
          }
        />

        <Route
          path="/:userName/post/:pId"
          element={user ? <PostPage /> : <Navigate to="/auth" />}
        />
      </Routes>

      {/* {user && <LogoutButton />} */}
      {/* {user && <CreatePost />} */}
    </Container>
  );
}

export default App;
