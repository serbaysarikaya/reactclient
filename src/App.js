import React, { useState } from "react";
import Constants from './utilities/Constants';
import PostCreateForm from "./components/PostCreateForm";
import PostUpdateForm from "./components/PostUpdateForm";



export default function App() {
  const [posts, setPosts] = useState([]);
  const [showingCreateNewPostForm, setShowingCreateNewPostForm] = useState(false);
  const [postCurrentlyBeingUpdated, setPostCurrentlyBeingUpdated] = useState(null);

  function getPost() {
    const url = Constants.API_URL_GET_ALL_POST;
    fetch(url, {
      method: 'GET',
    })
      .then(response => response.json()) // Buradaki parantezi ekledim
      .then(postsFromServer => {
        console.log(postsFromServer);
        setPosts(postsFromServer); // Verileri state'e atmak istiyorsanız burada setPosts kullanabilirsiniz.
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  }

  function deletePost(postId){
    const url =`${Constants.API_URL_DELETE_POST_BY_ID}/${postId}`;
       fetch(url, {
      method: 'DELETE',
    })
      .then(response => response.json()) // Buradaki parantezi ekledim
      .then(responseFromServer => {
     console.log(responseFromServer);
     onPostDeleted(postId);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  }

  return (
    <div className="container">
      <div className="row min-vh-100">
        <div className="col d-flex flex-column justify-content-center align-items-center">
          {(showingCreateNewPostForm === false && postCurrentlyBeingUpdated === null) && (
            <div>
              <h1>ASP .Net  Core React Tutorial</h1>
              <div className="mt-5">
                <button onClick={getPost} className="btn btn-dark btn-lg w-100">Get Posts from server</button>
                <button onClick={() => setShowingCreateNewPostForm(true)} className="btn btn-secondary btn-lg w-100 mt-4">Creat New Post</button>
              </div>
            </div>
          )}

          {(posts.length > 0 && showingCreateNewPostForm === false && postCurrentlyBeingUpdated === null) && renderPostTable()}

          {showingCreateNewPostForm && <PostCreateForm onPostCreated={onPostCreated} />}

          {postCurrentlyBeingUpdated !== null && <PostUpdateForm post={postCurrentlyBeingUpdated} onPostUpdated={onPostUpdated} />}

        </div>
      </div>
    </div>
  );

  function renderPostTable() {
    return (
      <div className="table-responsive mt-5">
        <table className="table table-bordered border-dark">
          <thead>
            <tr>
              <th scope="col">PostId (PK)</th>
              <th scope="col">Title</th>
              <th scope="col">Content</th>
              <th scope="col">CRUD Operation</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.postId}>
                <th scope="row">{post.postId}</th>
                <td>{post.title}</td>
                <td>{post.content}</td>
                <td>
                  <button  onClick={()=> setPostCurrentlyBeingUpdated(post)} className="btn btn-dark btn-lg mx-3 my-3">Update</button>
                  <button onClick={()=>{if(window.confirm(`Are You sure you want to delete the post title "${post.title}"?`)) deletePost(post.postId)}} className="btn btn-secondary btn-lg">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setPosts([])} className="btn btn-dark btn-lg w-100">Empty React posts array</button>
      </div>
    );
  }

  function onPostCreated(createdPost) {
    setShowingCreateNewPostForm(false)
    if (createdPost === null) {
      return;
    }
    alert(`Post Successfully created. `)

    getPost();
  }
  function onPostUpdated (updatedPost) {
    setPostCurrentlyBeingUpdated(null);
  
    if (updatedPost === null) {
      return;
    }
    let postCopy = [...posts];
    const index = postCopy.findIndex((postCopyPost, currentIndex) => {
      if (postCopyPost.postId === updatedPost.postId) {
        return true;
      }
    });
    if (index !== -1) {
      postCopy[index] = updatedPost;
    }
    setPosts(postCopy);
  
    alert(`Post successfully updated. After click OK, look for the.."${updatedPost.title}"`)
  }

  function onPostDeleted (deletedPostPostId) {
       let postCopy = [...posts];

    const index = postCopy.findIndex((postCopyPost, currentIndex) => {
      if (postCopyPost.postId === deletedPostPostId) {
        return true;
      }
    });
    if (index !== -1) {
      postCopy.splice(index,1);
    }
    setPosts(postCopy);
  
    alert(`Post successfully deleted. After click Ok, look at the table below to see your post disapper.`)
  }

  
}


