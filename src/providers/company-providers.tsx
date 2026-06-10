"use client";

import { createClients } from "@/lib/supabase/client";
import { ICompany } from "@/types/company";
import { createContext, useContext, useEffect, useState } from "react";

interface CompanyContextType {
  companies: ICompany[];
  activeCompany: ICompany | null;
  setActiveCompany: (company: ICompany) => void;
  isLoading: boolean;
  refreshCompanies: () => Promise<void>;
  allCompaniesMode: boolean;
  setAllCompaniesMode: (mode: boolean) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClients()
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [activeCompany, setActiveCompanyState] = useState<ICompany | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [allCompaniesMode, setAllCompaniesMode] = useState(false);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;

      setCompanies(data || []);

      // Set default active company
      if (data && data.length > 0 && !activeCompany) {
        // Try to get from localStorage first
        const savedCompanyId = localStorage.getItem("activeCompanyId");
        const savedCompany = data.find((c) => c.id === savedCompanyId);
        setActiveCompanyState(savedCompany || data[0]);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setActiveCompany = (company: ICompany) => {
    setActiveCompanyState(company);
    setAllCompaniesMode(false);
    localStorage.setItem("activeCompanyId", company.id);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <CompanyContext.Provider
      value={{
        companies,
        activeCompany,
        setActiveCompany,
        isLoading,
        refreshCompanies: fetchCompanies,
        allCompaniesMode,
        setAllCompaniesMode,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);

  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}
