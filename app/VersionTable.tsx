'use client';

import { Link, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { NPM } from './downloader';

interface Props {
  versions: NPM.VersionData[]
}

export function VersionTable({ versions }: Props) {
  return (
    <Table aria-label='version table'>
      <TableHeader>
        <TableColumn>version</TableColumn>
        <TableColumn>updated_at</TableColumn>
      </TableHeader>
      <TableBody>
        {versions.map(v => (
          <TableRow key={v.version}>
            <TableCell>
                <Link href={v.dist.tarball} className='text-sm'>{v.version}</Link>
            </TableCell>
            <TableCell>
              <div className='text-xs'>{v.updated_at}</div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}