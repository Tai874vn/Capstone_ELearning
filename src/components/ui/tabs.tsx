"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

const TabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
}>({
  activeTab: '',
  setActiveTab: () => {},
});

const Tabs = ({ defaultValue, className, children }: TabsProps) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ className, children }: TabsListProps) => (
  <div
    className={cn(
      "inline-flex h-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-1 text-gray-600 dark:text-gray-300 shadow-sm",
      className
    )}
  >
    {children}
  </div>
);

const TabsTrigger = ({ value, className, children }: TabsTriggerProps) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md border border-gray-200 dark:border-gray-600"
          : "hover:bg-white/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white",
        className
      )}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, className, children }: TabsContentProps) => {
  const { activeTab } = React.useContext(TabsContext);

  if (activeTab !== value) return null;

  return (
    <div
      className={cn(
        "mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent }