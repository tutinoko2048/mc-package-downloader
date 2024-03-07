'use client';

import { Link, Select, SelectItem, Spacer, Spinner } from '@nextui-org/react';
import React from 'react';
import { NPM, Packages, getPackageVersions, packages } from './downloader';
import { VersionTable } from './VersionTable';

export default function Page() {
  const [packageName, setPackageName] = React.useState<Packages>('server');
  const [packageLoading, setPackageLoading] = React.useState<boolean>(false);
  const [packageVersions, setPackageVersions] = React.useState<NPM.VersionData[]>([]);
  const [packageType, setPackageType] = React.useState<string>('');

  const onChangePackage = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Packages || packageName;
    const type = packageType in packages[value].typeList ? packageType : Object.keys(packages[value].typeList)[0];
    setPackageName(value);
    if (e.target.value) {
      setPackageType(type)
      setPackageLoading(true);
      await updateVersions(value, type);
    }
  }

  const onChangeType = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || packageType;
    setPackageType(value);
    if (e.target.value) {
      setPackageLoading(true);
      await updateVersions(packageName, value);
    }
  }

  const updateVersions = async (packageName: Packages, type: string) => {
    setPackageVersions([]);
    const versions = await getPackageVersions(packageName, type);
    setPackageVersions(versions);
    setPackageLoading(false);
  }

  return (
    <main>
      <Spacer y={3} />
      <h1 className='text-2xl'>Minecraft Package Downloader</h1>
      <Spacer y={3} />
      <div className='horizontal'>
        <Select required label='Package Name' size='sm' selectedKeys={[packageName]} onChange={onChangePackage}>
          {Object.keys(packages).map(mcpackage => <SelectItem key={mcpackage}>{`@minecraft/${mcpackage}`}</SelectItem>)}
        </Select>
        <Spacer x={1} y={1} />
        <Select required label='Package Type' size='sm' selectedKeys={[packageType]} onChange={onChangeType}>
          {Object.keys(packages[packageName].typeList).map(type => <SelectItem key={type}>{type}</SelectItem>)}
        </Select>
      </div>
      
      <Spacer y={4} />
      {packageLoading && <Spinner />}
      {!packageLoading && <VersionTable versions={packageVersions} />}

    </main>
  )
}