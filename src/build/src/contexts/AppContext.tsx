import type { HostRecord } from '@/types/hosts';
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import parseHosts from '@/utils/parser';
import HostForm from '@/components/app/HostForm';
import compareObjects from '@/utils/compare';

interface AppContextType {
  hosts: HostRecord[];
  hostsContent: string;
  saveHosts: () => Promise<void>;
  editSingleHost?: (index: number, newHost: HostRecord) => void;
  openAddForm: () => void;
  openEditForm: (index: number) => void;
  editHosts: (newHosts: HostRecord[]) => void;
  resetHosts: () => void;
  hasUpdatedHosts: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

const hostsPath = 'C:\\Windows\\System32\\drivers\\etc\\hosts';

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [hosts, setHosts] = useState<HostRecord[]>([]);
  const [hostsContent, setHostsContent] = useState<string>('');
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);
  const [originalHosts, setOriginalHosts] = useState<HostRecord[]>([]);
  const [hasUpdatedHosts, setHasUpdatedHosts] = useState<boolean>(false);
  const [hostToEdit, setHostToEdit] = useState<number | null>(null);

  useEffect(() => {
    if (window.electron) {
      window.electron
        .invoke('get-system-info')
        .then(response => {
          if (response.platform === 'win32') {
            const hosts = window.electron.readFile('C:\\Windows\\System32\\drivers\\etc\\hosts');
            setHostsContent(hosts);
            setHosts(parseHosts(hosts));
            setOriginalHosts(parseHosts(hosts));
          }
        })
        .catch(err => console.error(err));
    } else {
      console.error('window.electron is undefined!');
    }
  }, []);

  const saveHosts = async () => {
    let hostsContent = '';
    hosts.forEach(host => {
      if (host.hasComment && !host.ip && host.domains.length === 0) {
        // Linha é apenas um comentário
        hostsContent += `# ${host.comment}\n`;
      } else {
        // Linha com IP, domínios e/ou comentário
        const domains = host.domains.join(' ');
        const comment = host.comment ? `# ${host.comment}` : '';
        hostsContent += `${host.ip} ${domains} ${comment}\n`.trim() + '\n';
      }
    });

    if (window.electron) {
      try {
        const update = await window.electron.writeFile(hostsPath, `${hostsContent}`);

        if (update.success) {
          setOriginalHosts(hosts);
          toast.success('O arquivo de hosts do Windows foi atualizado com sucesso!');
        } else {
          toast.error('Ocorreu um erro ao atualizar o arquivo de hosts do Windows.');
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    } else {
      console.error('window.electron is undefined!');
    }
  };

  const editSingleHost = (index: number, newHost: HostRecord) => {
    setHosts(prevHosts => {
      const updatedHosts = [...prevHosts];
      updatedHosts[index] = newHost;
      return updatedHosts;
    });
  };
  const editHosts = (newHosts: HostRecord[]) => {
    setHosts(newHosts);
  };

  useEffect(() => {
    if (compareObjects(hosts, originalHosts)) {
      setHasUpdatedHosts(false);
    } else {
      setHasUpdatedHosts(true);
    }
  }, [hosts, originalHosts]);

  const openAddForm = () => {
    setIsAddFormOpen(true);
  };

  const openEditForm = (index: number) => {
    setIsAddFormOpen(true);
    setHostToEdit(index);
  };

  const resetHosts = () => {
    setHosts(originalHosts);
  };

  const handleSubmitHostForm = (data: HostRecord) => {
    const newHost: HostRecord = {
      checked: false,
      ip: data.ip,
      domains: data.domains,
      hasComment: false,
      comment: data.comment
    };
    if (hostToEdit) {
      editSingleHost(hostToEdit, newHost);
    } else {
      setHosts(prevHosts => [...prevHosts, newHost]);
    }
    setIsAddFormOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        hosts,
        hostsContent,
        saveHosts,
        editSingleHost,
        openAddForm,
        openEditForm,
        editHosts,
        resetHosts,
        hasUpdatedHosts
      }}
    >
      {children}
      <Toaster />
      <HostForm
        open={isAddFormOpen}
        onCancel={() => {
          setIsAddFormOpen(false);
          setHostToEdit(null);
        }}
        onSubmit={handleSubmitHostForm}
        hostIndex={hostToEdit}
      />
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
