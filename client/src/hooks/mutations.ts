import { useMutation, useQueryClient } from "react-query";

import { ImageType } from "@components/ImageCard";
import { ToastNotification } from "@utils/toastConfig";
import catchAsyncError from "src/api/catchError";
import { getClient } from "src/api/client";
import { IAppointment, IMedication } from "../../../server/src/models/schedule";
import { Post, Reply } from "src/@types/post";
import { updateFollowings, updateProfile, UserProfile } from "src/store/auth";
import { generateObjectId } from "@utils/helper";
import { useDispatch } from "react-redux";

interface DeleteFileParams {
  fileId: string;
  folderName: string;
  handleCloseMoreOptionsPress: () => void;
}

interface UpdateFileParams {
  fileId: string;
  folderName: string;
  title: string;
  description: string;
  handleCloseMoreOptionsPress: () => void;
}

export const useFileMutations = () => {
  const queryClient = useQueryClient();

  const { isLoading: deleteLoading, mutate: deleteFileMutation } = useMutation<
    void,
    Error,
    DeleteFileParams,
    unknown
  >(
    async ({ fileId, folderName }) => {
      // Construct the URL with query parameters
      const url = `/file/file-delete?fileId=${fileId}&folderName=${folderName}`;
      const client = await getClient();
      await client.delete(url);
    },
    {
      onMutate: async (variables) => {
        return { ...variables };
      },
      // Invalidate related queries on success to refresh the UI
      onSuccess: (data, variables) => {
        const { fileId, folderName } = variables;

        queryClient.setQueryData(
          ["folder-files", folderName],
          (oldData: ImageType[] | undefined) => {
            if (!oldData) {
              return [];
            }
            // Filter out the deleted file
            return oldData?.filter((file) => file._id !== fileId) ?? [];
          }
        );

        queryClient.invalidateQueries(["folders-length"]);
        ToastNotification({
          message: "File deleted successfully",
        });
      },
      onError: (error) => {
        const errorMessage = catchAsyncError(error);
        ToastNotification({
          type: "Error",
          message: errorMessage,
        });
      },
      onSettled: (data, error, variables) => {
        variables?.handleCloseMoreOptionsPress();
      },
    }
  );

  const { isLoading: updateLoading, mutate: updateFileMutation } = useMutation<
    void,
    Error,
    UpdateFileParams,
    unknown
  >(
    async ({ fileId, title, description, folderName }) => {
      const client = await getClient();
      const url = `/file/file-update?fileId=${fileId}&folderName=${folderName}`;
      return client.patch(url, { title: title, description });
    },
    {
      onSuccess: (data, variables) => {
        const { fileId, folderName, description, title } = variables;
        // Optimistically update the local cache
        queryClient.setQueryData(
          ["folder-files", folderName],
          (oldData: ImageType[] | undefined) => {
            if (!oldData) {
              return [];
            }
            return oldData.map((file) => {
              if (file._id === fileId) {
                return { ...file, title, description };
              }
              return file;
            });
          }
        );
        ToastNotification({ message: "File updated successfully" });
      },
      onError: (error) => {
        const errorMessage = catchAsyncError(error);
        ToastNotification({
          type: "Error",
          message: errorMessage,
        });
      },
      onSettled: (data, error, variables) => {
        variables?.handleCloseMoreOptionsPress();
      },
    }
  );

  return {
    deleteFileMutation,
    deleteLoading,
    updateFileMutation,
    updateLoading,
  };
};

interface DeleteScheduleParams {
  scheduleId: string;
  scheduleName: string;
  handleCloseMoreOptionsPress: () => void;
}

interface UpdateScheduleParams {
  scheduleId: string;
  scheduleName: string;
  title?: string;
  location?: string;
  date?: Date;
  notes?: string;
  reminder?: string;
  name?: string;
  frequency?: string;
  timesPerDay?: string;
  specificDays?: string[];
  prescriber?: string;
  handleCloseMoreOptionsPress: () => void;
}

type ScheduleItem = IAppointment | IMedication;

const isAppointment = (item: ScheduleItem): item is IAppointment => {
  return (item as IAppointment).title !== undefined;
};

const isMedication = (item: ScheduleItem): item is IMedication => {
  return (item as IMedication).name !== undefined;
};

export const useScheduleMutations = () => {
  const queryClient = useQueryClient();

  const { isLoading: deleteLoading, mutate: deleteScheduleMutation } =
    useMutation<void, Error, DeleteScheduleParams, unknown>(
      async ({ scheduleId, scheduleName }) => {
        // Construct the URL with query parameters
        const url = `/schedule/schedule-delete?scheduleId=${scheduleId}&scheduleName=${scheduleName}`;
        const client = await getClient();
        await client.delete(url);
      },
      {
        onMutate: async (variables) => {
          return { ...variables };
        },
        // Invalidate related queries on success to refresh the UI
        onSuccess: (data, variables) => {
          const { scheduleId, scheduleName } = variables;

          queryClient.setQueryData(
            ["schedules", scheduleName],
            (oldData: IAppointment[] | undefined) => {
              if (!oldData) {
                return [];
              }

              // Filter out the deleted schedule
              return (
                oldData?.filter(
                  (schedule) => schedule._id.toString() !== scheduleId
                ) ?? []
              );
            }
          );

          variables?.handleCloseMoreOptionsPress();

          ToastNotification({
            message: `${variables?.scheduleName.slice(
              0,
              -1
            )} deleted successfully`,
          });
        },
        onError: (error, variables) => {
          variables?.handleCloseMoreOptionsPress();

          const errorMessage = catchAsyncError(error);
          ToastNotification({
            type: "Error",
            message: errorMessage,
          });
        },
      }
    );

  const { isLoading: updateLoading, mutate: updateScheduleMutation } =
    useMutation<void, Error, UpdateScheduleParams, unknown>(
      async ({
        scheduleId,
        scheduleName,
        title,
        location,
        date,
        notes,
        reminder,
        name,
        frequency,
        timesPerDay,
        specificDays,
        prescriber,
      }) => {
        const client = await getClient();

        const url = `/schedule/${scheduleName.slice(
          0,
          -1
        )}-update?scheduleId=${scheduleId}&scheduleName=${scheduleName}`;

        const updateData = {
          title,
          location,
          date,
          notes,
          reminder,
          name,
          frequency,
          timesPerDay,
          specificDays,
          prescriber,
        };

        return client.patch(url, updateData);
      },
      {
        onSuccess: (data, variables) => {
          const {
            scheduleId,
            scheduleName,
            title,
            location,
            date,
            notes,
            reminder,
            name,
            frequency,
            timesPerDay,
            specificDays,
            prescriber,
          } = variables;

          // Optimistically update the local cache
          queryClient.setQueryData<ScheduleItem[]>(
            ["schedules", scheduleName],
            (oldData) => {
              if (!oldData) return [];
              return oldData.map((schedule) => {
                if (schedule._id.toString() === scheduleId) {
                  if (isAppointment(schedule)) {
                    return {
                      ...schedule,
                      title: title,
                      location: location,
                      date: date,
                      notes: notes,
                      reminder: reminder,
                    } as IAppointment;
                  } else if (isMedication(schedule)) {
                    return {
                      ...schedule,
                      name: name,
                      frequency: frequency,
                      timesPerDay: timesPerDay,
                      specificDays: specificDays,
                      prescriber: prescriber,
                      notes: notes,
                    } as IMedication;
                  }
                }
                return schedule;
              });
            }
          );

          // close Modal
          variables?.handleCloseMoreOptionsPress();

          ToastNotification({
            message: `${variables?.scheduleName.slice(
              0,
              -1
            )} updated successfully`,
          });
        },
        onError: (error, variables) => {
          // close Modal
          variables?.handleCloseMoreOptionsPress();

          const errorMessage = catchAsyncError(error);
          ToastNotification({
            type: "Error",
            message: errorMessage,
          });
        },
      }
    );

  return {
    deleteScheduleMutation,
    deleteLoading,
    updateScheduleMutation,
    updateLoading,
  };
};

interface DeletePostParams {
  postId: string;
  ownerId: string;
  cancerType: string;
  handleCloseMoreOptionsPress: () => void;
}

export const usePostMutations = () => {
  const queryClient = useQueryClient();

  const { isLoading: deleteLoading, mutate: deletePostMutation } = useMutation<
    void,
    Error,
    DeletePostParams,
    unknown
  >(
    async ({ postId, ownerId }) => {
      // Construct the URL with query parameters
      const url = `/post/post-delete?postId=${postId}&ownerId=${ownerId}`;
      const client = await getClient();
      await client.delete(url);
    },
    {
      onMutate: async (variables) => {
        return { ...variables };
      },
      // Invalidate related queries on success to refresh the UI
      onSuccess: (data, variables) => {
        const { postId, cancerType } = variables;

        queryClient.setQueryData(
          ["posts", cancerType],
          (oldData: Post[] | undefined) => {
            if (!oldData) {
              return [];
            }

            // Filter out the deleted post
            return (
              oldData?.filter((post) => post._id.toString() !== postId) ?? []
            );
          }
        );
        // close Modal
        variables?.handleCloseMoreOptionsPress();

        ToastNotification({
          message: "Your post has been deleted successfully",
        });
      },
      onError: (error, variables) => {
        // close Modal
        variables?.handleCloseMoreOptionsPress();

        const errorMessage = catchAsyncError(error);
        ToastNotification({
          type: "Error",
          message: errorMessage,
        });
      },
    }
  );

  interface FormDataObject {
    description: string;
    forumType: string;
    image: {
      uri: string;
      type: string;
      name: string;
    } | null;
  }

  interface UpdatePostParams {
    postId: string;
    ownerId: string;
    cancerType: string;
    formData: FormData;
    formDataObject: FormDataObject;
    resetPostFields: () => void;
  }

  const { isLoading: updateLoading, mutate: updatePostMutation } = useMutation<
    void,
    Error,
    UpdatePostParams,
    unknown
  >(
    async ({ postId, ownerId, formData }) => {
      const client = await getClient({
        "Content-Type": "multipart/form-data;",
      });

      const url = `/post/?postId=${postId}&ownerId=${ownerId}`;
      return client.patch(url, formData);
    },
    {
      onSuccess: (data, variables) => {
        const { postId, cancerType, formDataObject } = variables;

        // Extract formData values
        const { description, forumType, image } = formDataObject;

        // Optimistically update the local cache
        queryClient.setQueryData<Post[]>(
          ["posts", cancerType],
          (oldData: Post[] | undefined) => {
            if (!oldData) return [];
            return oldData.map((post) => {
              if (post._id.toString() === postId) {
                return {
                  ...post,
                  description: description,
                  forumType: forumType,
                  image: image
                    ? { public_id: image.uri, url: image.uri }
                    : null,
                };
              }
              return post;
            });
          }
        );

        variables?.resetPostFields();
      },
      onError: (error, variables) => {
        const errorMessage = catchAsyncError(error);
        ToastNotification({
          type: "Error",
          message: errorMessage,
        });
      },
    }
  );

  interface FavoritePostParams {
    postId: string;
    profile: UserProfile | null;
    cancerType: string;
    publicProfile: boolean;
    publicUserId: string;
  }

  const { isLoading: favoriteLoading, mutate: favoritePostMutation } =
    useMutation<void, Error, FavoritePostParams, unknown>(
      async ({ postId, profile }) => {
        if (!postId || !profile?.id) return;
        const client = await getClient();
        await client.post(`/post/update-post-favorite?postId=${postId}`);
      },
      {
        onSuccess: (data, variables) => {
          const { postId, profile, cancerType, publicProfile, publicUserId } =
            variables;
          if (!profile) return;

          // Optimistically update the local cache
          const queryKey = publicProfile
            ? ["profile-posts", publicUserId]
            : ["posts", cancerType];

          queryClient.setQueryData<Post[]>(queryKey, (oldData) => {
            if (!oldData) return [];

            return oldData.map((post) => {
              if (post._id.toString() === postId) {
                const isLiked = post.likes.some(
                  (like) => like.userId._id === profile?.id
                );

                return {
                  ...post,
                  likes: isLiked
                    ? post.likes.filter(
                        (like) => like.userId._id !== profile?.id
                      )
                    : [
                        ...post.likes,
                        {
                          _id: generateObjectId(),
                          userId: {
                            _id: profile?.id,
                            avatar: {
                              url: profile?.avatar || "",
                              publicId: "",
                            },
                            name: profile?.name,
                            userType: profile?.userType,
                          },
                          createdAt: new Date().toISOString(),
                        },
                      ],
                };
              }
              return post;
            });
          });
        },
        onError: (error) => {
          const errorMessage = catchAsyncError(error);
          ToastNotification({
            type: "Error",
            message: errorMessage,
          });
        },
      }
    );

  return {
    deletePostMutation,
    deleteLoading,
    updatePostMutation,
    updateLoading,
    favoritePostMutation,
    favoriteLoading,
  };
};

export const useFollowMutations = () => {
  const queryClient = useQueryClient();

  interface UpdateFollowParams {
    profileId: string;
    currentUser: UserProfile | null;
  }

  const { isLoading: updateLoading, mutate: updateFollowMutation } =
    useMutation<void, Error, UpdateFollowParams>(
      async ({ profileId }) => {
        const client = await getClient();
        const url = `/profile/update-follower/${profileId}`;
        const { data } = await client.post(url);
        return data;
      },
      {
        onMutate: async (variables) => {
          const { profileId } = variables;

          if (!profileId) return;

          // Cancel any outgoing refetches
          await queryClient.cancelQueries(["followers", profileId]);
          await queryClient.cancelQueries(["followings", profileId]);
        },
        onError: (error, variables, context) => {
          const errorMessage = catchAsyncError(error);
          ToastNotification({
            type: "Error",
            message: errorMessage,
          });
        },
        onSettled: (data, error, variables) => {
          const { profileId, currentUser } = variables;
          // Invalidate queries to refetch data
          queryClient.invalidateQueries(["followers", profileId]);
          queryClient.invalidateQueries(["followings", currentUser?.id]);
        },
      }
    );

  return {
    updateFollowMutation,
    updateLoading,
  };
};

interface DeleteReplyParams {
  postId: string;
  replyId: string;
  cancerType: string;
  handleCloseMoreOptionsPress: () => void;
  onDeleteReply: (replyId: string) => void;
  publicProfile: boolean;
  publicUserId: string;
}

export const useReplyMutations = () => {
  const queryClient = useQueryClient();

  const { isLoading: deleteLoading, mutate: deleteReplyMutation } = useMutation<
    void,
    Error,
    DeleteReplyParams,
    unknown
  >(
    async ({ postId, replyId }) => {
      // Construct the URL with query parameters
      const url = `/post//reply-delete?postId=${postId}&replyId=${replyId}`;
      const client = await getClient();
      await client.delete(url);
    },
    {
      onMutate: async (variables) => {
        return { ...variables };
      },
      // Invalidate related queries on success to refresh the UI
      onSuccess: (data, variables) => {
        const { postId, replyId, cancerType, publicProfile, publicUserId } =
          variables;

        const queryKey = publicProfile
          ? ["profile-posts", publicUserId]
          : ["posts", cancerType];

        queryClient.setQueryData(queryKey, (oldData: Post[] | undefined) => {
          if (!oldData) return [];

          return oldData.map((post) => {
            if (post._id.toString() === postId) {
              return {
                ...post,
                replies: post.replies.filter(
                  (reply) => reply._id.toString() !== replyId
                ),
              };
            }
            return post;
          });
        });

        //To Refresh the PostReplies Page . . .
        variables?.onDeleteReply(replyId);

        // close Modal
        variables?.handleCloseMoreOptionsPress();

        ToastNotification({
          message: "Your reply has been deleted successfully",
        });
      },
      onError: (error, variables) => {
        // close Modal
        variables?.handleCloseMoreOptionsPress();

        const errorMessage = catchAsyncError(error);
        ToastNotification({
          type: "Error",
          message: errorMessage,
        });
      },
      onSettled(data, error, variables, context) {
        const { cancerType, publicUserId } = variables;
        queryClient.invalidateQueries(["posts", cancerType]);
        queryClient.invalidateQueries(["profile-posts", publicUserId]);
      },
    }
  );

  interface FavoriteReplyParams {
    postId: string;
    reply: Reply;
    profile: UserProfile | null;
    cancerType: string;
    onFavoriteReply: (reply: Reply, profile: UserProfile | null) => void;
    publicProfile: boolean;
    publicUserId: string;
  }

  const { isLoading: favoriteLoading, mutate: favoriteReplyMutation } =
    useMutation<void, Error, FavoriteReplyParams, unknown>(
      async ({ postId, reply }) => {
        if (!postId || !reply._id) return;
        const client = await getClient();
        await client.post(
          `/post/update-reply-favorite?postId=${postId}&replyId=${reply._id}`
        );
      },
      {
        onMutate: async (variables) => {
          const {
            postId,
            reply,
            profile,
            cancerType,
            publicProfile,
            publicUserId,
          } = variables;

          if (!reply._id) return;

          // Cancel any outgoing refetches
          await queryClient.cancelQueries(["posts", cancerType]);
          await queryClient.cancelQueries(["profile-posts", publicUserId]);

          const queryKey = publicProfile
            ? ["profile-posts", publicUserId]
            : ["posts", cancerType];

          // Snapshot the previous values
          const previousPosts = queryClient.getQueryData<Post[]>(queryKey);

          // Optimistically update the posts
          if (previousPosts) {
            queryClient.setQueryData(
              queryKey,
              previousPosts.map((post) => {
                if (post._id.toString() === postId) {
                  return {
                    ...post,
                    replies: post.replies.map((reply) =>
                      reply._id.toString() === reply._id
                        ? {
                            ...reply,
                            likes: reply.likes.some(
                              (like) =>
                                like.userId._id.toString() === profile?.id
                            )
                              ? reply.likes.filter(
                                  (like) =>
                                    like.userId._id.toString() !== profile?.id
                                )
                              : [
                                  ...reply.likes,
                                  {
                                    _id: generateObjectId(),
                                    userId: {
                                      _id: profile?.id,
                                      avatar: {
                                        url: profile?.avatar || "",
                                        publicId: "",
                                      },
                                      name: profile?.name,
                                      userType: profile?.userType,
                                    },
                                    createdAt: new Date().toISOString(),
                                  },
                                ],
                          }
                        : reply
                    ),
                  };
                }
                return post;
              })
            );
          }

          // Return a context with the previous values
          return { previousPosts };
        },
        onError: (error, variables, context) => {
          if (context?.previousPosts) {
            queryClient.setQueryData(
              ["posts", variables.cancerType],
              context.previousPosts
            );
          }

          const errorMessage = catchAsyncError(error);
          ToastNotification({
            type: "Error",
            message: errorMessage,
          });
        },
        onSuccess: (success, variables, context) => {
          const { reply, profile } = variables;
          //To Refresh the PostReplies Page . . .
          variables?.onFavoriteReply(reply, profile);
        },
        onSettled: (data, error, variables) => {
          const { cancerType, publicUserId } = variables;
          queryClient.invalidateQueries(["posts", cancerType]);
          queryClient.invalidateQueries(["profile-posts", publicUserId]);
        },
      }
    );

  return {
    deleteReplyMutation,
    deleteLoading,
    favoriteReplyMutation,
    favoriteLoading,
  };
};
