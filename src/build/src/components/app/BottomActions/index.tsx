import { Button } from "@/components/ui/button";
import { BiAnalyse, BiPlus } from "react-icons/bi";
import "./styles.scss";
import { useApp } from "@/contexts/AppContext";
import { useState } from "react";

const BottomActions = () => {
    const [loading, setLoading] = useState(false);
    const {
        saveHosts,
        addHost,
        hosts,
        editHosts,
        hasUpdatedHosts,
        resetHosts,
    } = useApp();

    const handleButtonClick = async () => {
        setLoading(true);
        saveHosts().then(() => {
            setLoading(false);
        });
    };

    const handleDeleteSelected = () => {
        const updatedHosts = hosts.filter((host) => !host.checked);
        editHosts(updatedHosts);

        console.log(
            `Apagando hosts selecionados: ${updatedHosts.length} hosts restantes`
        );
        // deselectAll();
    };

    const handleDisableSelected = () => {
        const updatedHosts = hosts.map((host) => {
            if (host.checked) {
                return { ...host, hasComment: true };
            }
            return host;
        });
        editHosts(updatedHosts);
        // deselectAll();
    };

    const handleEnableSelected = () => {
        const updatedHosts = hosts.map((host) => {
            if (host.checked) {
                return { ...host, hasComment: false };
            }
            return host;
        });
        editHosts(updatedHosts);
        // deselectAll();
    };

    return (
        <div className="app-bottom-actions draggable non-selectable">
            <Button
                variant="outline"
                className="non-draggable"
                onClick={addHost}
            >
                <BiPlus />
                Adicionar host
            </Button>

            {hosts.filter((host) => host.checked && host.hasComment).length >
                0 && (
                <Button
                    variant="outline"
                    className="non-draggable"
                    onClick={handleEnableSelected}
                >
                    Ativar ({hosts.filter((host) => host.checked).length})
                </Button>
            )}
            {hosts.filter((host) => host.checked && !host.hasComment).length >
                0 && (
                <Button
                    variant="outline"
                    className="non-draggable"
                    onClick={handleDisableSelected}
                >
                    Desativar ({hosts.filter((host) => host.checked).length})
                </Button>
            )}

            {hosts.filter((host) => host.checked).length > 0 && (
                <Button
                    variant="destructive"
                    className="non-draggable"
                    onClick={handleDeleteSelected}
                >
                    Apagar ({hosts.filter((host) => host.checked).length})
                </Button>
            )}

            <Button
                type="submit"
                className="non-draggable"
                onClick={handleButtonClick}
                disabled={!hasUpdatedHosts || loading}
            >
                Atualizar
                {loading && <BiAnalyse className="animate-spin" />}
            </Button>

            {hasUpdatedHosts && (
                <Button
                    variant="outline"
                    className="non-draggable ml-auto"
                    onClick={resetHosts}
                >
                    Desfazer alterações
                </Button>
            )}
        </div>
    );
};

export default BottomActions;
