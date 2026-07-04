import React, { useState, useEffect } from "react";
import { Users, BookOpen, Star, RefreshCw, Trash2, ShieldAlert, Award, MessageSquare } from "lucide-react";
import { Language, User } from "../types";
import { translations } from "../data/translations";

interface AdminProps {
  currentLanguage: Language;
  token: string;
  currentUser: User;
  onAdminLoginSuccess: (user: User, token: string) => void;
}

export default function AdminView({ currentLanguage, token, currentUser, onAdminLoginSuccess }: AdminProps) {
  const [isAdmin, setIsAdmin] = useState(currentUser.role === "admin");
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<any>({
    totalUsers: 0,
    premiumUsers: 0,
    linkedTelegram: 0,
    totalXp: 0,
    totalForumTopics: 0
  });

  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = (key: keyof typeof translations['en']) => translations[currentLanguage][key] || translations['en'][key];

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    try {
      // Fetch users
      const usersRes = await fetch("/api/admin/users", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      // Fetch analytics
      const analyticsRes = await fetch("/api/admin/analytics", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }
    } catch (err) {
      console.error("Admin data fetch error", err);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminUsername, password: adminPassword })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user.role === "admin") {
          setIsAdmin(true);
          onAdminLoginSuccess(data.user, data.token);
        } else {
          setLoginError("This user is not configured as an administrator.");
        }
      } else {
        const err = await response.json();
        setLoginError(err.error || "Authentication failed");
      }
    } catch (err) {
      setLoginError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserPremium = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/toggle-premium", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      if (response.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this student account?")) return;
    try {
      const response = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      if (response.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6" id="admin-login-lock">
        <div className="text-center space-y-2">
          <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Admin Authentication Lock</h2>
          <p className="text-xs text-slate-400">
            Please enter your administrator credentials to manage users, view database schemas, and adjust premium levels.
          </p>
        </div>

        {loginError && (
          <p className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl text-center">
            {loginError}
          </p>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-mono">ADMIN ID / EMAIL</label>
            <input
              type="text"
              required
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              placeholder="e.g., admin"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-mono">PASSWORD</label>
            <input
              type="password"
              required
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="e.g., d1ma1776"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-amber-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-sm py-3 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
            Unlock Portal (admin / d1ma1776)
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="admin-dashboard-panel">
      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-md">
          <div className="bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20 text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-slate-400 uppercase">{t("adminUsers")}</p>
            <p className="text-xl font-bold text-white mt-0.5">{analytics.totalUsers}</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-md">
          <div className="bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20 text-yellow-400">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-slate-400 uppercase">{t("adminSubscribers")}</p>
            <p className="text-xl font-bold text-white mt-0.5">
              {analytics.premiumUsers} <span className="text-[10px] text-slate-500 font-normal">({analytics.totalUsers ? Math.round((analytics.premiumUsers/analytics.totalUsers)*100) : 0}%)</span>
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-md">
          <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20 text-purple-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-slate-400 uppercase">{t("adminAnalytics")}</p>
            <p className="text-xl font-bold text-white mt-0.5">{analytics.totalXp} <span className="text-xs text-slate-500">XP</span></p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-md">
          <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-slate-400 uppercase">Forum Topics</p>
            <p className="text-xl font-bold text-white mt-0.5">{analytics.totalForumTopics}</p>
          </div>
        </div>

      </div>

      {/* User Manager Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Student Database Management</h3>
          <button 
            onClick={fetchAdminData}
            className="text-slate-400 hover:text-cyan-400 p-1.5 rounded-lg border border-slate-800 bg-slate-950 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-850">
              <tr>
                <th className="px-6 py-3.5 font-semibold text-[10px] uppercase">Username</th>
                <th className="px-6 py-3.5 font-semibold text-[10px] uppercase">Email</th>
                <th className="px-6 py-3.5 font-semibold text-[10px] uppercase">Level / XP</th>
                <th className="px-6 py-3.5 font-semibold text-[10px] uppercase">Telegram</th>
                <th className="px-6 py-3.5 font-semibold text-[10px] uppercase">Plan Type</th>
                <th className="px-6 py-3.5 font-semibold text-[10px] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-850/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">@{u.username}</td>
                  <td className="px-6 py-4 text-slate-400">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="text-cyan-400 font-bold">Lvl {u.levelProgress}</span>
                    <span className="text-slate-500 text-[10px] ml-2">({u.xp} XP)</span>
                  </td>
                  <td className="px-6 py-4">
                    {u.telegramLinked ? (
                      <span className="text-emerald-400 text-[10px]">@{u.telegramUsername}</span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Disconnected</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.isPremium 
                        ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" 
                        : "bg-slate-950 text-slate-500 border border-slate-850"
                    }`}>
                      {u.isPremium ? "PREMIUM" : "BASIC"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => toggleUserPremium(u.id)}
                      className="bg-slate-950 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-slate-800 px-2.5 py-1 rounded transition-colors cursor-pointer text-[10px] font-bold"
                    >
                      Toggle Premium
                    </button>
                    {u.id !== currentUser.id && (
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-1 rounded transition-colors cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
