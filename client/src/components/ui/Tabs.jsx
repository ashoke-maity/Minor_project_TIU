"use client"

function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === tab.id
                ? "bg-background text-foreground shadow-lg  border border-primary/90"
                : "hover:bg-background/50 hover:text-foreground"
            }`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Tabs
