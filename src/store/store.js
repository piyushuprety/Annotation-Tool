import {create} from 'zustand';

export const useStore = create((set, get) => ({
  // State
  images: {},
  currentImageId: null,
  activeCommentId: null,

  // Actions
  setImages: (images) => set({ images }),

  addImage: (imageId, imageData) =>
    set((state) => ({
      images: {
        ...state.images,
        [imageId]: {
          ...imageData,
          comments: {},
        },
      },
    })),

  setCurrentImageId: (id) =>
    set({
      currentImageId: id,
      activeCommentId: null,
    }),

  switchImage: (imageId) =>
    set({
      currentImageId: imageId,
      activeCommentId: null,
    }),

  setActiveComment: (commentId) =>
    set({
      activeCommentId: commentId,
    }),

  addComment: (imageId, commentId, commentData) =>
    set((state) => ({
      images: {
        ...state.images,
        [imageId]: {
          ...state.images[imageId],
          comments: {
            ...state.images[imageId].comments,
            [commentId]: {
              ...commentData,
              imageId, // Store the imageId in the comment for convenience
              replies: {},
            },
          },
        },
      },
    })),

  editComment: (imageId, commentId, newText) =>
    set((state) => ({
      images: {
        ...state.images,
        [imageId]: {
          ...state.images[imageId],
          comments: {
            ...state.images[imageId].comments,
            [commentId]: {
              ...state.images[imageId].comments[commentId],
              text: newText,
            },
          },
        },
      },
    })),

  deleteComment: (imageId, commentId) =>
    set((state) => {
      const newComments = { ...state.images[imageId].comments };
      delete newComments[commentId];

      return {
        images: {
          ...state.images,
          [imageId]: {
            ...state.images[imageId],
            comments: newComments,
          },
        },
        activeCommentId:
          state.activeCommentId === commentId ? null : state.activeCommentId,
      };
    }),

  addReply: (imageId, commentId, replyId, replyData) =>
    set((state) => ({
      images: {
        ...state.images,
        [imageId]: {
          ...state.images[imageId],
          comments: {
            ...state.images[imageId].comments,
            [commentId]: {
              ...state.images[imageId].comments[commentId],
              replies: {
                ...state.images[imageId].comments[commentId].replies,
                [replyId]: replyData,
              },
            },
          },
        },
      },
    })),

  editReply: (imageId, commentId, replyId, newText) =>
    set((state) => ({
      images: {
        ...state.images,
        [imageId]: {
          ...state.images[imageId],
          comments: {
            ...state.images[imageId].comments,
            [commentId]: {
              ...state.images[imageId].comments[commentId],
              replies: {
                ...state.images[imageId].comments[commentId].replies,
                [replyId]: {
                  ...state.images[imageId].comments[commentId].replies[replyId],
                  text: newText,
                },
              },
            },
          },
        },
      },
    })),

  deleteReply: (imageId, commentId, replyId) =>
    set((state) => {
      const newReplies = {
        ...state.images[imageId].comments[commentId].replies,
      };
      delete newReplies[replyId];

      return {
        images: {
          ...state.images,
          [imageId]: {
            ...state.images[imageId],
            comments: {
              ...state.images[imageId].comments,
              [commentId]: {
                ...state.images[imageId].comments[commentId],
                replies: newReplies,
              },
            },
          },
        },
      };
    }),
}));
