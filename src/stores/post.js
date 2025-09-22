import { defineStore } from "pinia";
import axios from "axios";

export const usePostStore = defineStore("post", {
  state: () => ({
    posts: [],
    selectedPost: null,
  }),
  actions: {
    async fetchPosts() {
      try {
        const res = await axios.get("https://post-it.epi-bluelock.bj/notes/");
        this.posts = res.data.notes;
      } catch (err) {
        console.log("Erreur FetchPosts : ", err);
      }
    },

    async deletePosts(id) {
      try {
        await axios.delete(`https://post-it.epi-bluelock.bj/notes/${id}`);
        this.fetchPosts();
      } catch (err) {
        console.log("Erreur deletePosts : ", err);
      }
    },

    async fetchPost(id) {
      try {
        const res = await axios.get(
          `https://post-it.epi-bluelock.bj/notes/${id}`
        );
        this.selectedPost = res.data.notes ?? res.data;
        console.log("selected post: " + this.selectedPost);
      } catch (err) {
        console.log("Erreur fetchPost : ", err);
      }
    },

    async updatePost(id, updatedData) {
      try {
        await axios.put(
          `https://post-it.epi-bluelock.bj/notes/${id}`,
          updatedData
        );
        this.fetchPosts();
      } catch (err) {
        console.log("Erreur updatePost : ", err);
      }
    },

    async addPost(payload) {
      try {
        await axios.post("https://post-it.epi-bluelock.bj/notes/", payload);
        this.fetchPosts();
      } catch (err) {
        console.log("Erreur addPost : ", err);
      }
    },
 
    async dynamicFetch(){
      setInterval(async ()=> 
       await this.fetchPosts(), 5000)
    }
  },
});
