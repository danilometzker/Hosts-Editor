import './styles.scss';
import type { ElectronAPI } from '../../types/electron';
import AppHeader from '@/components/app/Header';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import BottomActions from '@/components/app/BottomActions';
import { useApp } from '@/contexts/AppContext';
import type { HostRecord } from '@/types/hosts';
import { useEffect, useRef, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BiInfoCircle } from 'react-icons/bi';

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

function Home() {
  const { hosts, editSingleHost, editHosts, openEditForm } = useApp();
  const [allChecked, setAllChecked] = useState(false);
  const scrollRef = useRef<HTMLTableElement>(null);
  const prevTotalHosts = useRef<number>(hosts.length);

  const handleToggleHost = async (index: number, checked: boolean) => {
    const updatedHost = {
      ...hosts[index],
      hasComment: !checked
    };
    editSingleHost?.(index, updatedHost);
  };

  useEffect(() => {
    const updatedHosts = hosts.map(host => ({
      ...host,
      checked: allChecked
    }));

    editHosts(updatedHosts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allChecked]);

  useEffect(() => {
    if (scrollRef.current) {
      if (prevTotalHosts.current < hosts.length) {
        scrollRef.current.scrollIntoView(false);
      }
      prevTotalHosts.current = hosts.length;
    }
  }, [hosts]);

  return (
    <div>
      <AppHeader />
      <div className="non-draggable non-selectable">
        <div className="hosts-area">
          <ScrollArea className="scroll-area">
            {hosts.length > 0 && (
              <Table ref={scrollRef}>
                <TableHeader className="sticky-table-header">
                  <TableRow>
                    <TableHead>
                      <Checkbox
                        checked={allChecked}
                        onCheckedChange={checked => {
                          setAllChecked(checked as boolean);
                        }}
                      />
                    </TableHead>
                    <TableHead>Endereço de IP</TableHead>
                    <TableHead>Domínio(s)</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hosts.map((host: HostRecord, index: number) => {
                    if (host.ip && host.domains) {
                      return (
                        <Tooltip key={index}>
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              <Checkbox
                                checked={host.checked}
                                onCheckedChange={checked => {
                                  if (editSingleHost) {
                                    const updatedHost = {
                                      ...host,
                                      checked: checked as boolean
                                    };
                                    editSingleHost(index, updatedHost);
                                  }
                                }}
                              />
                            </TableCell>
                            <TooltipTrigger asChild>
                              <TableCell onClick={() => openEditForm(index)}>{host.ip}</TableCell>
                            </TooltipTrigger>
                            <TooltipTrigger asChild>
                              <TableCell onClick={() => openEditForm(index)}>
                                <div className="domains-container">
                                  {host.domains.join(', ')}
                                  {host.comment && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <BiInfoCircle />
                                      </TooltipTrigger>
                                      <TooltipContent side="right">
                                        <p>{host.comment}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              </TableCell>
                            </TooltipTrigger>
                            <TableCell className="text-right">
                              <div className="px-4">
                                <Switch
                                  color="#2d4864"
                                  onCheckedChange={checked => {
                                    handleToggleHost(index, checked);
                                  }}
                                  checked={!host.hasComment}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                          <TooltipContent side="bottom">
                            <p>Clique para editar</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    }
                  })}
                </TableBody>
              </Table>
            )}
          </ScrollArea>

          <BottomActions />
        </div>
      </div>
    </div>
  );
}

export default Home;
