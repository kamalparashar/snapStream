import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import firebaseService from "../firebase/config";
import { Input, Button, Container } from "../components/index";
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../store/postSlice";
import { addComment } from "../store/postSlice.js";
import { useForm } from "react-hook-form";

export default function Post() {
  const { register, handleSubmit, reset } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const postData = useSelector((state) => state.posts.posts);
  const [user, setUser] = useState([]);
  const [post, setPost] = useState(null);
  const initialComments = useSelector(
    (state) => state.posts.posts.find((p) => p.id === id)?.comments || []
  );
  const [comments, setComments] = useState(initialComments);

  useEffect(() => {
    if (id) {
      const postInfo = postData.find((post) => post.id === id);
      if (postInfo) {
        setPost(postInfo);
        firebaseService.getUser(postInfo.userId)
          .then((user) => {
            setUser(user);
          })
          .catch((error) => {
            console.log("Error while fetching userInfo.", error);
          });
      } else {
        navigate("/");
      }
    } else navigate("/");
  }, [id, navigate]);

  useEffect(() => {
    if (post) {
      async function fetchData() {
        const unsubscribe = firebaseService.getComments(
          post.id,
          (commentsList) => {
            setComments(commentsList)
            commentsList.forEach((comment) => {
              dispatch(addComment({ postId: post.id, ...comment }));
            });
          }
        );
        return () => {
          if (unsubscribe) {
            unsubscribe();
          }
        };
      }
      fetchData();
    }
  }, [post, dispatch]);

  const deletePost = () => {
    firebaseService.deletePost(post.id).then((status) => {
      if (status) {
        firebaseService.deleteFile(post.FeaturedImage).then((status) => {
          if (status) {
            dispatch(deletePost(post));
            navigate("/");
          }
        });
      }
    });
  };

  const submitComment = async (data) => {
    try {
      const res = await firebaseService.addComment({
        postId: id,
        comment: data.comment,
      });
      dispatch(
        addComment({
          postId: id,
          comment: res.comment,
          id: res.id,
          username: res.username,
          userId: res.userId,
        })
      );
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      reset({
        comment: "",
      });
    }
  };

  if (authStatus) {
    return post ? (
      <div className="w-full mt-8 ">
        <Container className="flex justify-between p-4 ">
          <div className="  w-6/12 bg-[#191919] border-2 border-gray-700">
            <div className=" flex items-center justify-between px-4 py-2">
              <div className="flex justify-evenly items-center gap-3">
                <img
                  src={user?.profilePhoto || ""}
                  alt="photo"
                  className="w-[4vmax] h-[4vmax] block border-[5px] border-double rounded-full"
                />
                <span className="whitespace-nowrap">
                  <strong>{user?.username || "kamal"}</strong>
                </span>
              </div>
              <div className="flex justify-start text-blue-500 ">Follow</div>
            </div>
            <div className="flex flex-col">
              <img src={post.FeaturedImage} />
            </div>
            <div className="flex gap-2 pt-4 pl-2">
              <strong>{post.username}</strong>
              {parse(post?.caption || "")}
            </div>
          </div>

          <div className=" w-5/12 pl-6 border border-gray-700 rounded-xl">
            <div className=" max-h-[600px] overflow-y-auto ">
              {authStatus ? (
                <div className="flex flex-col">
                  {comments?.map((comment) => (
                    <div key={comment.id} className="flex gap-2 px-2">
                      <strong>{comment.username}</strong>
                      <p>{comment.comment}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className=" ">
              {authStatus ? (
                <form
                  name="comment_form"
                  onSubmit={handleSubmit(submitComment)}
                >
                  <div className="flex w-full mt-3">
                    <Input
                      placeholder="add a comment..."
                      {...register("comment", {
                        required: true,
                      })}
                      className="py-2 focus:border-2 border-black"
                    />
                    <Button
                      type="submit"
                      children={"Post"}
                      className="w-1/5 bg-white border text-gray-600 text-center hover:bg-[#212121] hover:border-white hover:text-white"
                    />
                  </div>
                </form>
              ) : null}
            </div>
          </div>
        </Container>
      </div>
    ) : null;
  } else {
    navigate("/login");
  }
}
