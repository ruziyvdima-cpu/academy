import React, { useState, useEffect } from "react";
import { MessageSquare, Heart, Send, PlusCircle, AlertCircle, Bookmark, Tag } from "lucide-react";
import { Post, Language } from "../types";
import { translations } from "../data/translations";

interface ForumProps {
  currentLanguage: Language;
  token: string;
  username: string;
}

export default function ForumView({ currentLanguage, token, username }: ForumProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<"general" | "question" | "project" | "competition">("general");
  const [error, setError] = useState("");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  const t = (key: keyof typeof translations['en']) => translations[currentLanguage][key] || translations['en'][key];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/community/forum");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newTitle.trim() || !newContent.trim()) {
      setError("Title and content are required.");
      return;
    }

    try {
      const response = await fetch("/api/community/forum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          category: newCategory
        })
      });

      if (response.ok) {
        setNewTitle("");
        setNewContent("");
        setNewCategory("general");
        setShowAddForm(false);
        fetchPosts();
      } else {
        const errData = await response.json();
        setError(errData.error || "Failed to create post.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/community/forum/${postId}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleAddComment = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const commentText = commentInputs[postId] || "";
    if (!commentText.trim()) return;

    try {
      const response = await fetch(`/api/community/forum/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentText })
      });

      if (response.ok) {
        setCommentInputs(prev => ({ ...prev, [postId]: "" }));
        fetchPosts();
      }
    } catch (err) {
      console.error("Comment failed", err);
    }
  };

  const filteredPosts = selectedCategory === "all"
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6 animate-fadeIn" id="academy-forum">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2 font-sans">
            <MessageSquare className="text-[#00F0FF] w-6 h-6" />
            {t("forumTitle")}
          </h2>
          <p className="text-gray-400 text-sm mt-1 font-mono">
            {currentLanguage === "uz" 
              ? "Savollar bering, g'oyalar bilan bo'lishing va muhandislik jamoasi bilan hamkorlik qiling."
              : currentLanguage === "ru"
              ? "Задавайте вопросы, делитесь идеями и кооперируйтесь с другими инженерами."
              : "Ask questions, share project code, and team up with fellow robotics students."}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#00F0FF] hover:bg-white text-black font-mono font-black uppercase tracking-wider text-xs px-4 py-2.5 rounded-none border border-black shadow-[3px_3px_0_rgba(0,255,65,0.4)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer self-start sm:self-auto flex items-center justify-center gap-2"
          id="forum-toggle-add-btn"
        >
          <PlusCircle className="w-4 h-4" />
          {t("addPost")}
        </button>
      </div>

      {/* Add New Topic form */}
      {showAddForm && (
        <form onSubmit={handleCreatePost} className="bg-[#080808] border-2 border-[#111] rounded-none p-6 space-y-4 shadow-2xl animate-fadeIn font-mono" id="new-post-form">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-[#00F0FF] pl-2">{t("addPost")}</h3>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-none flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs text-gray-500 uppercase">{t("postTitle")}</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., L298N motor driver heating up on 12V..."
                className="w-full bg-black border border-[#222] rounded-none px-4 py-2.5 text-sm text-gray-100 outline-none focus:border-[#00F0FF]/80 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 uppercase">{t("forumCategory")}</label>
              <select
                value={newCategory}
                onChange={(e: any) => setNewCategory(e.target.value)}
                className="w-full bg-black border border-[#222] rounded-none px-4 py-2.5 text-sm text-gray-100 outline-none focus:border-[#00F0FF]/80 cursor-pointer font-mono"
              >
                <option value="general">{t("forumGeneral")}</option>
                <option value="question">{t("forumQuestion")}</option>
                <option value="project">{t("forumProject")}</option>
                <option value="competition">{t("forumCompetition")}</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 uppercase">{t("postContent")}</label>
            <textarea
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Explain your issue or describe your custom robotics project here. Post code lines if needed..."
              className="w-full bg-black border border-[#222] rounded-none p-4 text-sm text-gray-100 outline-none focus:border-[#00F0FF]/80 font-mono"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-500 hover:text-gray-300 text-xs font-bold uppercase cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#00F0FF] hover:bg-white text-black px-5 py-2 rounded-none text-xs font-bold uppercase tracking-wider border border-black shadow-[3px_3px_0_rgba(0,255,65,0.4)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
            >
              Post Topic
            </button>
          </div>
        </form>
      )}

      {/* Categories filter row */}
      <div className="flex flex-wrap gap-2 border-b border-[#222] pb-3">
        {["all", "general", "question", "project", "competition"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-none text-xs font-bold uppercase tracking-wider font-mono transition-all cursor-pointer border ${
              selectedCategory === cat
                ? "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF] shadow-[2px_2px_0_rgba(0,255,65,0.2)]"
                : "bg-black text-gray-500 border-[#222] hover:text-white hover:border-gray-500"
            }`}
          >
            {cat === "all" ? "All Posts" : t(`forum${cat.charAt(0).toUpperCase() + cat.slice(1)}` as any) || cat}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-[#080808] border-2 border-[#111] rounded-none p-8 text-center text-gray-500 font-mono text-sm uppercase tracking-wider">
            No topics found in this category. Be the first to open a discussion!
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div 
              key={post.id} 
              className={`bg-[#080808] border-2 transition-all duration-300 rounded-none p-5 ${
                expandedPostId === post.id ? "border-[#00F0FF] shadow-[0_0_15px_rgba(0,255,65,0.06)]" : "border-[#111] hover:border-[#222]"
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-gray-400 px-2 py-0.5 rounded-none text-[10px] font-mono border border-[#222]">
                      @{post.username}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-black tracking-tight text-white pt-1 uppercase font-sans">{post.title}</h3>
                </div>
                
                {/* Category label */}
                <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-none flex items-center gap-1 ${
                  post.category === "question" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                  post.category === "project" ? "bg-emerald-500/10 text-[#00F0FF] border border-[#00F0FF]/20" :
                  post.category === "competition" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                  "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>
                  <Tag className="w-2.5 h-2.5" />
                  {t(`forum${post.category.charAt(0).toUpperCase() + post.category.slice(1)}` as any) || post.category}
                </span>
              </div>

              {/* Body Content */}
              <p className="text-gray-300 text-sm mt-3 leading-relaxed whitespace-pre-wrap font-sans">
                {post.content}
              </p>

              {/* Action Bar */}
              <div className="flex items-center gap-4 mt-5 pt-4 border-t border-[#111] text-xs font-mono">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                    post.likedBy?.includes(username) ? "text-[#00F0FF] font-bold" : "text-gray-500 hover:text-[#00F0FF]"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.likedBy?.includes(username) ? "fill-[#00F0FF] stroke-[#00F0FF]" : ""}`} />
                  <span>{post.likes}</span>
                </button>

                <button
                  onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-[#00F0FF] cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments?.length || 0} Comments</span>
                </button>
              </div>

              {/* Expanded Comments Panel */}
              {expandedPostId === post.id && (
                <div className="mt-5 pt-4 border-t border-[#111] space-y-4 animate-slideDown">
                  <div className="space-y-3 pl-2 border-l-2 border-[#00F0FF]">
                    {post.comments?.length === 0 ? (
                      <p className="text-gray-500 text-xs font-mono">No comments yet. Drop your engineering insights below!</p>
                    ) : (
                      post.comments?.map((comment) => (
                        <div key={comment.id} className="bg-black p-3 rounded-none border border-[#222] space-y-1">
                           <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-300 font-mono">@{comment.username}</span>
                            <span className="text-[9px] text-gray-600 font-mono">
                              {new Date(comment.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs leading-relaxed font-sans">{comment.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment input */}
                  <form 
                    onSubmit={(e) => handleAddComment(e, post.id)} 
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder="Write a constructive reply..."
                      className="flex-1 bg-black border border-[#222] rounded-none px-4 py-2 text-xs text-gray-200 outline-none focus:border-[#00F0FF] font-mono"
                    />
                    <button
                      type="submit"
                      className="bg-[#0a0a0a] hover:bg-[#00F0FF] text-[#00F0FF] hover:text-black px-3.5 py-2 rounded-none text-xs font-bold border border-[#222] flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
