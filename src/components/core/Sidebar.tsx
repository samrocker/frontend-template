"use client"

import { useState } from "react"
import { LuUser, LuGraduationCap } from "react-icons/lu"
import { FaUserCheck, FaFlag, FaBoxOpen, FaTags, FaShoppingCart, FaCode, FaRegComments } from "react-icons/fa"
import { CiLogout } from "react-icons/ci"
import Image from "next/image"
import Logo from "../../../public/image/Brand-Logo.png"

const sidebarFolders = [
  { label: "School", icon: LuGraduationCap, category: "main" },
  { label: "Subscription", icon: FaTags, category: "main" },
  { label: "User", icon: LuUser, category: "main" },
  { label: "Approval", icon: FaUserCheck, category: "management" },
  { label: "Referral", icon: LuUser, category: "management" },
  { label: "Flag", icon: FaFlag, category: "management" },
  { label: "Pack", icon: FaBoxOpen, category: "commerce" },
  { label: "Pricing", icon: FaTags, category: "commerce" },
  { label: "Purchase", icon: FaShoppingCart, category: "commerce" },
  { label: "Code", icon: FaCode, category: "development" },
  { label: "Feedback", icon: FaRegComments, category: "development" },
]

const categories = {
  main: "Core",
  management: "Management",
  commerce: "Commerce",
  development: "Development",
}

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("School")
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const groupedItems = sidebarFolders.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, typeof sidebarFolders>,
  )

  return (
    <div className="bg-background w-72 h-screen flex flex-col border-r border-border shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-center mb-2">
          <div className="relative group">
            <Image
              src={Logo || "/placeholder.svg"}
              alt="Soundwave Logo"
              width={120}
              height={120}
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 
              bg-gradient-to-r 
              from-primary/10 to-secondary/10 
              rounded-full opacity-0 group-hover:opacity-100 
              transition-opacity duration-300" 
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {Object.entries(groupedItems).map(([categoryKey, items]) => (
          <div key={categoryKey} className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              {categories[categoryKey as keyof typeof categories]}
            </h3>
            <nav className="space-y-1">
              {items.map(({ label, icon: Icon }) => {
                const isActive = activeItem === label
                const isHovered = hoveredItem === label

                return (
                  <button
                    key={label}
                    onClick={() => setActiveItem(label)}
                    onMouseEnter={() => setHoveredItem(label)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`
                      w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-200 ease-out group relative overflow-hidden
                      ${
                        isActive
                          ? "bg-muted border border-primary text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }
                    `}
                  >
                    {/* Active indicator */}
                    <div
                      className={`
                        absolute left-0 top-0 h-full w-1 bg-primary rounded-r-full
                        transition-all duration-300 ease-out
                        ${isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}
                      `}
                    />

                    {/* Icon container with micro-interaction */}
                    <div
                      className={`
                        flex items-center justify-center w-5 h-5 mr-3 relative
                        transition-transform duration-200 ease-out
                        ${isHovered ? "scale-110" : "scale-100"}
                      `}
                    >
                      <Icon
                        className={`
                          w-4 h-4 transition-all duration-200
                          ${isActive ? "text-primary" : "text-current"}
                        `}
                      />

                      {/* Subtle glow effect on hover */}
                      <div
                        className={`
                          absolute inset-0 bg-primary/20 rounded-full blur-sm
                          transition-opacity duration-300
                          ${isHovered && !isActive ? "opacity-100" : "opacity-0"}
                        `}
                      />
                    </div>

                    {/* Label */}
                    <span className="flex-1 text-left transition-all duration-200">{label}</span>

                    {/* Subtle arrow indicator for active item */}
                    <div
                      className={`
                        w-1.5 h-1.5 rounded-full bg-primary
                        transition-all duration-300 ease-out
                        ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"}
                      `}
                    />

                    {/* Hover background effect */}
                    <div
                      className={`
                        absolute inset-0 bg-muted/50 rounded-xl
                        transition-opacity duration-200
                        ${isHovered && !isActive ? "opacity-100" : "opacity-0"}
                      `}
                    />
                  </button>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onMouseEnter={() => setHoveredItem("logout")}
          onMouseLeave={() => setHoveredItem(null)}
          className="relative w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 group"
        >
          <div className="flex items-center justify-center w-5 h-5 mr-3 relative">
            <CiLogout
              className={`
                w-4 h-4 transition-all duration-200
                ${hoveredItem === "logout" ? "scale-110 rotate-3" : "scale-100 rotate-0"}
              `}
            />
          </div>
          <span>Log out</span>

          {/* Subtle hover effect */}
          <div
            className={`
              absolute inset-0 bg-destructive/10 rounded-xl
              transition-opacity duration-200
              ${hoveredItem === "logout" ? "opacity-100" : "opacity-0"}
            `}
          />
        </button>
      </div>
    </div>
  )
}

export default Sidebar
