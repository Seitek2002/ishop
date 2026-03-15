'use client';

import { ReactNode, useMemo } from "react";

export const ProductDescription = ({
  name,
  description,
}: {
  name: string;
  description?: string;
}) => {
  const descriptionNodes = useMemo(() => {
    const trimmed = (description ?? '').trim();
    if (!trimmed) return null;

    const lines = trimmed
      .split(/\r\n|\n|\r/)
      .map((l) => l.trim())
      .filter(Boolean);
    const nodes: ReactNode[] = [];
    let list: string[] = [];

    const pushList = () => {
      if (list.length) {
        nodes.push(
          <ul
            key={`ul-${nodes.length}`}
            className='list-disc pl-5 my-2 space-y-1 text-gray-600 text-sm'
          >
            {list.map((li, idx) => (
              <li key={idx}>{li}</li>
            ))}
          </ul>,
        );
        list = [];
      }
    };

    lines.forEach((line) => {
      if (/^-/.test(line)) list.push(line.replace(/^-\s*/, '').trim());
      else {
        pushList();
        nodes.push(
          <p key={`p-${nodes.length}`} className='text-gray-600 text-sm my-1'>
            {line}
          </p>,
        );
      }
    });
    pushList();
    return nodes;
  }, [description]);

  return (
    <>
      <h2 className='text-2xl font-bold text-gray-900 mb-2'>{name}</h2>
      <div className='mb-6'>{descriptionNodes}</div>
    </>
  );
};
