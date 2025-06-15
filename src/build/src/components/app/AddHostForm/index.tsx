import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

type AddHostFormProps = {
    open: boolean;
    onSubmit?: (data: any) => void;
    onCancel?: () => void;
};

const AddHostForm = (props: AddHostFormProps) => {
    const formRef = React.useRef<HTMLFormElement>(null);

    const handleSubmit = () => {
        if (!formRef.current) return;

        const formData = new FormData(formRef.current);
        const ip = formData.get("ip") as string;
        const domains = formData.get("domains") as string;
        const data = {
            ip: ip.trim(),
            domains: domains.split(",").map((domain) => domain.trim()),
        };
        console.log("Dados do novo host:", data);
        if (props.onSubmit) {
            props.onSubmit(data);
        }
    };
    return (
        <div className="non-selectable">
            <Dialog open={props.open} onOpenChange={props.onCancel}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Adicionar novo host</DialogTitle>
                        <DialogDescription>
                            Preencha os campos abaixo para adicionar um novo
                            host.
                        </DialogDescription>
                    </DialogHeader>
                    <form ref={formRef}>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="ip">Endereço de IP</Label>
                                <Input
                                    id="ip"
                                    name="ip"
                                    defaultValue="127.0.0.1"
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="domains">Domínios</Label>
                                <Input
                                    id="domains"
                                    name="domains"
                                    defaultValue=""
                                />
                            </div>
                        </div>
                    </form>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleSubmit}>
                            Adicionar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddHostForm;
