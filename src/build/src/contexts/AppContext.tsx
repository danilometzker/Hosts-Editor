import type { HostRecord } from "@/types/hosts";
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import parseHosts from "@/utils/parser";
import AddHostForm from "@/components/app/AddHostForm";
import compareObjects from "@/utils/compare";

interface AppContextType {
    hosts: HostRecord[];
    hostsContent: string;
    saveHosts: () => Promise<void>;
    editSingleHost?: (index: number, newHost: HostRecord) => void;
    addHost: () => void;
    editHosts: (newHosts: HostRecord[]) => void;
    resetHosts: () => void;
    hasUpdatedHosts: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

const hostsPath = "C:\\Windows\\System32\\drivers\\etc\\hosts";

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [hosts, setHosts] = useState<HostRecord[]>([]);
    const [hostsContent, setHostsContent] = useState<string>("");
    const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);
    const [originalHosts, setOriginalHosts] = useState<HostRecord[]>([]);
    const [hasUpdatedHosts, setHasUpdatedHosts] = useState<boolean>(false);

    useEffect(() => {
        if (window.electron) {
            window.electron
                .invoke("get-system-info")
                .then((response) => {
                    if (response.platform === "win32") {
                        const hosts = window.electron.readFile(
                            "C:\\Windows\\System32\\drivers\\etc\\hosts"
                        );
                        setHostsContent(hosts);
                        setHosts(parseHosts(hosts));
                        setOriginalHosts(parseHosts(hosts));
                    }
                })
                .catch((err) => console.error(err));
        } else {
            console.error("window.electron is undefined!");
        }
    }, []);

    const saveHosts = async () => {
        let hostsContent = "";
        hosts.forEach((host) => {
            if (host.hasComment) {
                hostsContent += `# ${host.ip} ${host.domains.join(" ")}\n`;
            } else {
                hostsContent += `${host.ip} ${host.domains.join(" ")}\n`;
            }
        });

        if (window.electron) {
            try {
                const update = await window.electron.writeFile(
                    hostsPath,
                    `${hostsContent}`
                );

                if (update.success) {
                    setOriginalHosts(hosts);
                    toast.success(
                        "O arquivo de hosts do Windows foi atualizado com sucesso!"
                    );
                } else {
                    toast.error(
                        "Ocorreu um erro ao atualizar o arquivo de hosts do Windows."
                    );
                }
            } catch (error) {
                toast.error((error as Error).message);
            }
        } else {
            console.error("window.electron is undefined!");
        }
    };

    const editSingleHost = (index: number, newHost: HostRecord) => {
        setHosts((prevHosts) => {
            const updatedHosts = [...prevHosts];
            updatedHosts[index] = newHost;
            return updatedHosts;
        });
    };
    const editHosts = (newHosts: HostRecord[]) => {
        setHosts(newHosts);
        console.log(`editado`, newHosts.length);
    };

    useEffect(() => {
        if (compareObjects(hosts, originalHosts)) {
            setHasUpdatedHosts(false);
        } else {
            setHasUpdatedHosts(true);
        }
    }, [hosts]);

    const addHost = () => {
        setIsAddFormOpen(true);
    };

    const resetHosts = () => {
        setHosts(originalHosts);
    };

    return (
        <AppContext.Provider
            value={{
                hosts,
                hostsContent,
                saveHosts,
                editSingleHost,
                addHost,
                editHosts,
                resetHosts,
                hasUpdatedHosts,
            }}
        >
            {children}
            <Toaster />
            <AddHostForm
                open={isAddFormOpen}
                onCancel={() => setIsAddFormOpen(false)}
                onSubmit={(data) => {
                    const newHost: HostRecord = {
                        checked: false,
                        ip: data.ip,
                        domains: data.domains,
                        hasComment: false,
                    };
                    setHosts((prevHosts) => [...prevHosts, newHost]);
                    setIsAddFormOpen(false);
                }}
            />
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
