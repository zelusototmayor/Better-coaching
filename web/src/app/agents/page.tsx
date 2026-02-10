'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import { useAuthStore } from '@/lib/store';

interface Agent {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  avatarUrl?: string;
  category: string;
  tags: string[];
  tier: string;
  ratingAvg: number;
  ratingCount: number;
  usageCount: number;
  creator?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  emoji: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AgentsPage() {
  const { accessToken } = useAuthStore();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/agents`).then(r => r.json()),
      fetch(`${API_URL}/api/agents/categories`).then(r => r.json()),
    ]).then(([agentsData, categoriesData]) => {
      setAgents(agentsData.agents || []);
      setCategories(categoriesData.categories || categoriesData || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = agents.filter(a => {
    if (selectedCategory && a.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        (a.tagline || '').toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q) ||
        a.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Coaching Marketplace
          </h1>
          <p className="text-gray-600 text-lg">
            Discover AI coaches across categories — find the right guide for your journey.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search coaches by name, topic, or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-gray-900 bg-white shadow-sm"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !selectedCategory
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          {filtered.length} coach{filtered.length !== 1 ? 'es' : ''} available
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No coaches found matching your criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
              className="mt-4 text-indigo-600 font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((agent) => (
              <Link
                key={agent.id}
                href={`/agents/${agent.id}`}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                    {agent.avatarUrl ? (
                      <img src={agent.avatarUrl} alt={agent.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      agent.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{agent.tagline}</p>
                  </div>
                  {agent.tier === 'FREE' && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Free
                    </span>
                  )}
                </div>

                {agent.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {agent.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-3">
                    {agent.ratingAvg > 0 && (
                      <span>⭐ {agent.ratingAvg.toFixed(1)}</span>
                    )}
                    <span>{agent.usageCount} sessions</span>
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {agent.tags?.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        {accessToken && (
          <div className="mt-12 text-center">
            <Link
              href="/agents/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
            >
              ✨ Create Your Own Coach
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
