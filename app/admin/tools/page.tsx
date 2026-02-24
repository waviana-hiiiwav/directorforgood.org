"use client"

import { useState, useMemo } from "react"
import { getAllTools, getToolsByCategory, getAllCategories, getCategoryDescription, searchTools, type Tool, type ToolCategory } from "@/lib/fdd-tools"
import Link from "next/link"

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | "all">("all")
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)

  const allTools = getAllTools()
  const categories = getAllCategories()

  const filteredTools = useMemo(() => {
    let tools = allTools

    if (selectedCategory !== "all") {
      tools = getToolsByCategory(selectedCategory)
    }

    if (searchQuery.trim()) {
      tools = searchTools(searchQuery).filter(tool => 
        selectedCategory === "all" || tool.category === selectedCategory
      )
    }

    return tools.sort((a, b) => a.name.localeCompare(b.name))
  }, [searchQuery, selectedCategory, allTools])

  const getPricingBadgeColor = (model: string) => {
    switch (model) {
      case "free":
        return "bg-green-100 text-green-800"
      case "freemium":
        return "bg-blue-100 text-blue-800"
      case "subscription":
        return "bg-purple-100 text-purple-800"
      case "transaction":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getComplexityBadgeColor = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">FDD Tools Database</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive catalog of tools for Forward Deployed Directors ({allTools.length} tools)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tools List */}
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                All ({allTools.length})
              </button>
              {categories.map((category) => {
                const categoryTools = getToolsByCategory(category)
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)} ({categoryTools.length})
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tools List */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">
              {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"}
            </h2>
            {filteredTools.length === 0 ? (
              <div className="border rounded-lg p-8 text-center text-muted-foreground">
                No tools found matching your criteria.
              </div>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => setSelectedTool(tool)}
                    className={`border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedTool?.id === tool.id ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{tool.name}</h3>
                      <div className="flex gap-2 flex-wrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getPricingBadgeColor(
                            tool.pricing.model
                          )}`}
                        >
                          {tool.pricing.model}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getComplexityBadgeColor(
                            tool.setupComplexity
                          )}`}
                        >
                          {tool.setupComplexity}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{tool.category}</span>
                      {tool.tags.includes("essential") && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded font-medium">
                          Essential
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tool Details */}
        <div className="lg:sticky lg:top-8 lg:h-fit">
          {selectedTool ? (
            <div className="border rounded-lg p-6 bg-card">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedTool.name}</h2>
                <div className="flex gap-2 flex-wrap">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getPricingBadgeColor(
                      selectedTool.pricing.model
                    )}`}
                  >
                    {selectedTool.pricing.model}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getComplexityBadgeColor(
                      selectedTool.setupComplexity
                    )}`}
                  >
                    {selectedTool.setupComplexity}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <a
                    href={selectedTool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {selectedTool.url}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedTool.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">When to Use</h3>
                  <p className="text-sm text-muted-foreground">{selectedTool.whenToUse}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Pricing</h3>
                  <p className="text-sm text-muted-foreground">{selectedTool.pricing.notes}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">FDD Notes</h3>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                    {selectedTool.fddNotes}
                  </p>
                </div>

                {selectedTool.integrations.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Integrations</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTool.integrations.map((integration) => (
                        <span
                          key={integration}
                          className="px-2 py-1 bg-muted rounded text-xs"
                        >
                          {integration}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTool.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 rounded text-xs ${
                          tag === "essential"
                            ? "bg-yellow-100 text-yellow-800 font-medium"
                            : "bg-muted"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Category</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {selectedTool.category} - {getCategoryDescription(selectedTool.category)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center text-muted-foreground">
              Select a tool to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



