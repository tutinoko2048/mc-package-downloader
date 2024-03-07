'use client'

import { Select, SelectItem, Spinner } from '@nextui-org/react';
import React from 'react';
import { getPackageVersions } from './downloader';

const packages = [
  { name: 'server', label: '@minecraft/server' },
  { name: 'server-ui', label: '@minecraft/server-ui' },
  { name: 'vanilla-data', label: '@minecraft/vanilla-data' },
  { name: 'math', label: '@minecraft/math' },
  { name: 'server-net', label: '@minecraft/gametest' },
]

export default function Page() {
  const [packageName, setPackageName] = React.useState<string>('');
  const [packageLoading, setPackageLoading] = React.useState<boolean>(false);
  const [packageVersions, setPackageVersions] = React.useState<string[]>([]);

  const onChangePackage = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPackageName(value);
    if (value) setPackageLoading(true);
    setPackageVersions([]);
    const versions = await getPackageVersions(value);
    setPackageVersions(versions)
    setPackageLoading(false);
  }

  return (
    <main>
      <h1>Minecraft Package Downloader</h1>
      <br />
      <Select required items={packages} label='Select package' size='sm' selectedKeys={[packageName]} onChange={onChangePackage}>
        {packages.map(mcpackage => <SelectItem key={mcpackage.name}>{`@minecraft/${mcpackage.name}`}</SelectItem>)}
      </Select>
      {packageLoading && <Spinner />}
      {...packageVersions.map(v => <div key={v}>{v}</div>)}
    </main>
  )
}