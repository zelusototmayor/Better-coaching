'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store';
import { agentsApi } from '@/lib/api';

const CATEGORIES = [
  { value: '', label: 'All Coaches' },
  { value: 'career', label: '💼 Career' },
  { value: 'wellness', label: '🧘 Wellness' },
  { value: 'leadership', label: '👑 Leadership' },
  { value: 'communication', label: '🗣️ Communication' },
  { value: 'productivity', label: '⚡ Productivity' },
  { value: 'relationships', label: '❤️ Relationships' },
  { value: 'mindset', label: '🧠 Mindset' },
  { value: 'fitness', label: '💪 Fitness' },
  { value: 'finance', label: '💰 Finance' },
  { value: 'other', label: '✨ Other' },
];

interface Agent {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  avatarUrl?: string;
  category: string;
  tags: string[];
  tier: string;
  usageCount: number;
  ratingAvg: number;
  ratingCount: number;
}

export default function AgentsMarketplacePage() {
  const { isAuthenticated } = useAuthStore();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadAgents();
  }, [selectedCategory]);

  async function loadAgents() {
    try {
      setLoading(true);
      const params: { category?: string; search?: string } = {};
      if (selectedCategory) params.category = selectedCategory;
      if (search) params.search = search;
      const { agents } = await agentsApi.browseAgents(params);
      setAgents(agents);
    } catch {
      setError('Failed to load coaches');
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadAgents();
  }

  const getCategoryEmoji = (cat: string) => {
    const found = CATEGORIES.find(c => c.value === cat);
    return found ? found.label.split(' ')[0] : '✨';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">Better Coaching</span>
          </Link>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">
                  My Agents
                </Link>
                <Link
                  href="/agents/new"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition"
                >
                  Create Coach
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-400 hover:text-white transition">
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find Your AI Coach
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
          Browse AI coaching agents built by real coaches. Get personalized guidance
          on career, wellness, leadership, and more.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Search coaches..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition"
          >
            Search
          </button>
        </form>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Agents Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">{error}</div>
        ) : agents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No coaches found yet.</p>
            <Link
              href="/agents/new"
              className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition"
            >
              Be the first to create one →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map(agent => (
              <Link
                key={agent.id}
                href={`/agents/${agent.id}`}
                className="group bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 hover:bg-gray-900/80 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-800 flex items-center justify-center text-2xl shrink-0">
                    {agent.avatarUrl ? (
                      <Image
                        src={agent.avatarUrl}
                        alt={agent.name}
                        width={56}
                        height={56}
                        className="rounded-xl object-cover"
                      />
                    ) : (
                      getCategoryEmoji(agent.category)
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-indigo-400 transition truncate">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{agent.tagline}</p>
                  </div>
                </div>

                {agent.description && (
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {agent.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="px-2 py-1 bg-gray-800 rounded-full capitalize">
                    {agent.category}
                  </span>
                  <div className="flex items-center gap-3">
                    {agent.ratingCount > 0 && (
                      <span>⭐ {agent.ratingAvg.toFixed(1)}</span>
                    )}
                    <span>{agent.usageCount} sessions</span>
                  </div>
                </div>

                {agent.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {agent.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-800 text-gray-500 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
