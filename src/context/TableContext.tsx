import React, { createContext, useContext, useState } from 'react';

interface TableState {
  page: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  search: string;
}

interface TableContextType {
  state: TableState;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSort: (field: string) => void;
  setSearch: (term: string) => void;
}

const defaultState: TableState = {
  page: 1,
  pageSize: 10,
  sortBy: '',
  sortDirection: 'asc',
  search: ''
};

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TableState>(defaultState);

  const setPage = (page: number) => {
    setState(prev => ({ ...prev, page }));
  };

  const setPageSize = (pageSize: number) => {
    setState(prev => ({ ...prev, pageSize, page: 1 }));
  };

  const setSort = (field: string) => {
    setState(prev => ({
      ...prev,
      sortBy: field,
      sortDirection: prev.sortBy === field && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  };

  const setSearch = (search: string) => {
    setState(prev => ({ ...prev, search, page: 1 }));
  };

  return (
    <TableContext.Provider value={{ state, setPage, setPageSize, setSort, setSearch }}>
      {children}
    </TableContext.Provider>
  );
};