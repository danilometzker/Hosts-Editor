import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import type { HostRecord } from '@/types/hosts';
import React from 'react';

type HostFormProps = {
  open: boolean;
  onSubmit?: (data: HostRecord) => void;
  onCancel?: () => void;
  hostIndex?: number | null;
};

const HostForm = (props: HostFormProps) => {
  const { hosts } = useApp();
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = () => {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const ip = formData.get('ip') as string;
    const domains = formData.get('domains') as string;
    const comment = formData.get('description') as string;
    const data = {
      ip: ip.trim(),
      domains: domains.split(',').map(domain => domain.trim()),
      checked: false,
      hasComment: false,
      comment: comment
    };
    console.log('Dados do novo host:', data);
    if (props.onSubmit) {
      props.onSubmit(data);
    }
  };
  return (
    <div className="non-selectable">
      <Dialog open={props.open} onOpenChange={props.onCancel}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{!props.hostIndex ? 'Adicionar novo host' : 'Editar host'}</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para adicionar um novo host.
            </DialogDescription>
          </DialogHeader>
          <form ref={formRef}>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="ip">Endereço de IP</Label>
                <Input
                  id="ip"
                  name="ip"
                  defaultValue={props.hostIndex ? hosts[props.hostIndex].ip : '127.0.0.1'}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="domains">Domínios</Label>
                <Input
                  id="domains"
                  name="domains"
                  defaultValue={props.hostIndex ? hosts[props.hostIndex].domains.join(', ') : ''}
                  placeholder="Separe os domínios com vírgula"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  className="resize-none"
                  id="description"
                  name="description"
                  defaultValue={props.hostIndex ? hosts[props.hostIndex].comment || '' : ''}
                  placeholder="Insira uma descrição (opcional)"
                />
              </div>
            </div>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit}>
              {!props.hostIndex ? 'Adicionar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HostForm;
